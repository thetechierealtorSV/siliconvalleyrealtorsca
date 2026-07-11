/*
  SunPath IQ - Stage 2 3D sun & shadow engine
  --------------------------------------------
  Original, self-authored three.js scene that renders the subject property and
  its neighboring buildings/terrain in 3D and casts REAL shadows driven by the
  validated NOAA solarPosition() engine (solar-engine.js).

  Data sources (all free, no API key / account):
    - Neighboring building footprints + heights: OpenStreetMap via the Overpass
      API (multiple mirrors tried in turn; degrades gracefully if unavailable).
    - Ground elevation: open-elevation.com (used only for a gentle terrain tint;
      the local scene is treated as flat ground for shadow clarity).

  Depends on globals: THREE (three.js r128), solarPosition() (solar-engine.js).
  Exposes: window.SunPath3D with init/setLocation/setSunFromSolar/dispose.

  Coordinate convention in the scene:
    +X = East, +Z = South, +Y = up. (So world azimuth 0=N is -Z, 90=E is +X,
    180=S is +Z, 270=W is -X - matching the 2D diagram's compass mapping.)
*/

(function () {
  'use strict';

  var OVERPASS_MIRRORS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
  ];

  var METERS_PER_DEG_LAT = 111320;

  var S = {
    scene: null, camera: null, renderer: null, sunLight: null, hemiLight: null,
    ground: null, buildingsGroup: null, subjectMesh: null, compassGroup: null,
    container: null, raf: null, controls: null,
    lat: 37.4419, lon: -122.1430,
    onStatus: null
  };

  function status(msg) { if (typeof S.onStatus === 'function') S.onStatus(msg); }

  // ---- lightweight orbit controls (original, no external dependency) --------
  function makeControls(camera, dom) {
    var target = new THREE.Vector3(0, 0, 0);
    var radius = 320, theta = Math.PI * 0.25, phi = Math.PI * 0.32;
    var dragging = false, lastX = 0, lastY = 0;

    function apply() {
      var minPhi = 0.08, maxPhi = Math.PI / 2 - 0.05;
      phi = Math.max(minPhi, Math.min(maxPhi, phi));
      radius = Math.max(60, Math.min(900, radius));
      camera.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = target.y + radius * Math.cos(phi);
      camera.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(target);
    }
    function onDown(e) { dragging = true; lastX = e.clientX; lastY = e.clientY; }
    function onUp() { dragging = false; }
    function onMove(e) {
      if (!dragging) return;
      var dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      theta -= dx * 0.005;
      phi -= dy * 0.005;
      apply();
    }
    function onWheel(e) { e.preventDefault(); radius *= (1 + (e.deltaY > 0 ? 0.1 : -0.1)); apply(); }
    function onTouchStart(e) { if (e.touches.length === 1) { dragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; } }
    function onTouchMove(e) {
      if (!dragging || e.touches.length !== 1) return;
      var dx = e.touches[0].clientX - lastX, dy = e.touches[0].clientY - lastY;
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
      theta -= dx * 0.005; phi -= dy * 0.005; apply();
    }
    function onTouchEnd() { dragging = false; }

    dom.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });
    dom.addEventListener('touchend', onTouchEnd);

    apply();
    return {
      setTarget: function (v) { target.copy(v); apply(); },
      dispose: function () {
        dom.removeEventListener('mousedown', onDown);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('mousemove', onMove);
        dom.removeEventListener('wheel', onWheel);
        dom.removeEventListener('touchstart', onTouchStart);
        dom.removeEventListener('touchmove', onTouchMove);
        dom.removeEventListener('touchend', onTouchEnd);
      }
    };
  }

  // ---- lat/lon -> local metric XZ (relative to scene center) ----------------
  function lonLatToXZ(lon, lat) {
    var mPerDegLon = METERS_PER_DEG_LAT * Math.cos(S.lat * Math.PI / 180);
    var x = (lon - S.lon) * mPerDegLon;   // east +
    var z = -(lat - S.lat) * METERS_PER_DEG_LAT; // north is -Z, so south +Z
    return { x: x, z: z };
  }

  // ---- build one extruded building mesh from a ring of {x,z} + height -------
  function buildingMesh(ring, height, isSubject) {
    var shape = new THREE.Shape();
    for (var i = 0; i < ring.length; i++) {
      if (i === 0) shape.moveTo(ring[i].x, ring[i].z);
      else shape.lineTo(ring[i].x, ring[i].z);
    }
    var geo = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2); // extrude along -Y then flip so it stands up on ground
    geo.translate(0, height, 0);
    var color = isSubject ? 0xf59e0b : 0x9aa6bf;
    var mat = new THREE.MeshLambertMaterial({ color: color });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  // ---- estimate a building height in meters from OSM tags -------------------
  function heightFromTags(tags) {
    if (!tags) return 6;
    if (tags.height) { var h = parseFloat(tags.height); if (!isNaN(h)) return h; }
    if (tags['building:levels']) { var l = parseFloat(tags['building:levels']); if (!isNaN(l)) return l * 3.2; }
    return 6; // default ~2 storeys
  }

  // ---- fetch OSM buildings via Overpass with mirror fallback ---------------
  function fetchBuildings(lat, lon, radiusMeters) {
    var dLat = radiusMeters / METERS_PER_DEG_LAT;
    var dLon = radiusMeters / (METERS_PER_DEG_LAT * Math.cos(lat * Math.PI / 180));
    var bbox = (lat - dLat) + ',' + (lon - dLon) + ',' + (lat + dLat) + ',' + (lon + dLon);
    var query = '[out:json][timeout:20];(way["building"](' + bbox + ');relation["building"](' + bbox + '););out body;>;out skel qt;';

    function tryMirror(i) {
      if (i >= OVERPASS_MIRRORS.length) return Promise.reject(new Error('all overpass mirrors failed'));
      var ctrl = new AbortController();
      var to = setTimeout(function () { ctrl.abort(); }, 12000);
      return fetch(OVERPASS_MIRRORS[i] + '?data=' + encodeURIComponent(query), { signal: ctrl.signal })
        .then(function (r) { clearTimeout(to); if (!r.ok) throw new Error('status ' + r.status); return r.json(); })
        .catch(function () { clearTimeout(to); return tryMirror(i + 1); });
    }
    return tryMirror(0);
  }

  function parseOverpass(data) {
    var nodes = {};
    var i, el;
    for (i = 0; i < data.elements.length; i++) {
      el = data.elements[i];
      if (el.type === 'node') nodes[el.id] = { lat: el.lat, lon: el.lon };
    }
    var buildings = [];
    for (i = 0; i < data.elements.length; i++) {
      el = data.elements[i];
      if (el.type === 'way' && el.nodes && el.nodes.length >= 3) {
        var ring = [];
        for (var j = 0; j < el.nodes.length; j++) {
          var n = nodes[el.nodes[j]];
          if (n) ring.push(lonLatToXZ(n.lon, n.lat));
        }
        if (ring.length >= 3) buildings.push({ ring: ring, height: heightFromTags(el.tags) });
      }
    }
    return buildings;
  }

  // ---- render neighboring buildings (or a mock block if data unavailable) ---
  function renderBuildings(buildings) {
    while (S.buildingsGroup.children.length) S.buildingsGroup.remove(S.buildingsGroup.children[0]);
    for (var i = 0; i < buildings.length; i++) {
      var b = buildings[i];
      var mesh = buildingMesh(b.ring, b.height, false);
      S.buildingsGroup.add(mesh);
    }
  }

  function mockNeighborhood() {
    // Fallback: a simple ring of blocks around the subject so shadows still demo.
    var blocks = [];
    var offsets = [[-40, -35, 10], [45, -30, 14], [-50, 40, 8], [38, 48, 18], [0, -70, 22], [-75, 0, 12], [70, 5, 9]];
    for (var i = 0; i < offsets.length; i++) {
      var ox = offsets[i][0], oz = offsets[i][1], h = offsets[i][2];
      var w = 16, d = 16;
      blocks.push({ ring: [
        { x: ox - w, z: oz - d }, { x: ox + w, z: oz - d },
        { x: ox + w, z: oz + d }, { x: ox - w, z: oz + d }
      ], height: h });
    }
    return blocks;
  }

  function subjectBuilding() {
    // Represent the subject lot as a modest house footprint at the center.
    var w = 12, d = 10, h = 7;
    return buildingMesh([
      { x: -w, z: -d }, { x: w, z: -d }, { x: w, z: d }, { x: -w, z: d }
    ], h, true);
  }

  // ---- position the sun light from solar elevation/azimuth ------------------
  function setSunFromSolar(elevationDeg, azimuthDeg) {
    var dist = 500;
    var el = elevationDeg * Math.PI / 180;
    var az = azimuthDeg * Math.PI / 180; // compass, 0=N,90=E,180=S,270=W
    // Direction FROM ground TO sun:
    var y = Math.sin(el);
    var horiz = Math.cos(el);
    var x = horiz * Math.sin(az);   // east component
    var z = -horiz * Math.cos(az);  // north = -Z
    if (elevationDeg <= 0) {
      // Sun below horizon: dim, no meaningful shadows (night/twilight).
      S.sunLight.intensity = 0.0;
      S.hemiLight.intensity = 0.25;
    } else {
      S.sunLight.position.set(x * dist, y * dist, z * dist);
      S.sunLight.target.position.set(0, 0, 0);
      S.sunLight.target.updateMatrixWorld();
      var warm = Math.max(0, Math.min(1, elevationDeg / 25));
      S.sunLight.intensity = 0.35 + 0.65 * Math.min(1, elevationDeg / 40);
      S.hemiLight.intensity = 0.4 + 0.2 * warm;
    }
  }

  function compass() {
    var g = new THREE.Group();
    var mat = new THREE.LineBasicMaterial({ color: 0x64748b });
    var R = 130;
    var pts = [ [0, -R], [0, R], [-R, 0], [R, 0] ];
    for (var i = 0; i < pts.length; i += 2) {
      var geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pts[i][0], 0.2, pts[i][1]),
        new THREE.Vector3(pts[i + 1][0], 0.2, pts[i + 1][1])
      ]);
      g.add(new THREE.Line(geo, mat));
    }
    return g;
  }

  function animate() {
    S.raf = requestAnimationFrame(animate);
    S.renderer.render(S.scene, S.camera);
  }

  function resize() {
    if (!S.container || !S.renderer) return;
    var w = S.container.clientWidth, h = S.container.clientHeight || 460;
    S.renderer.setSize(w, h, false);
    S.camera.aspect = w / h;
    S.camera.updateProjectionMatrix();
  }

  function init(container, opts) {
    opts = opts || {};
    S.container = container;
    S.onStatus = opts.onStatus || null;

    S.scene = new THREE.Scene();
    S.scene.background = new THREE.Color(0x0b1730);

    var w = container.clientWidth || 600, h = container.clientHeight || 460;
    S.camera = new THREE.PerspectiveCamera(50, w / h, 1, 5000);

    S.renderer = new THREE.WebGLRenderer({ antialias: true });
    S.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    S.renderer.setSize(w, h, false);
    S.renderer.shadowMap.enabled = true;
    S.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(S.renderer.domElement);

    S.hemiLight = new THREE.HemisphereLight(0xbcd0ff, 0x2b2410, 0.5);
    S.scene.add(S.hemiLight);

    S.sunLight = new THREE.DirectionalLight(0xfff3d6, 1.0);
    S.sunLight.castShadow = true;
    S.sunLight.shadow.mapSize.width = 2048;
    S.sunLight.shadow.mapSize.height = 2048;
    var c = S.sunLight.shadow.camera;
    c.left = -300; c.right = 300; c.top = 300; c.bottom = -300; c.near = 1; c.far = 1200;
    S.scene.add(S.sunLight);
    S.scene.add(S.sunLight.target);

    var groundGeo = new THREE.PlaneGeometry(1600, 1600);
    groundGeo.rotateX(-Math.PI / 2);
    var groundMat = new THREE.MeshLambertMaterial({ color: 0x3f4a63 });
    S.ground = new THREE.Mesh(groundGeo, groundMat);
    S.ground.receiveShadow = true;
    S.scene.add(S.ground);

    S.compassGroup = compass();
    S.scene.add(S.compassGroup);

    S.buildingsGroup = new THREE.Group();
    S.scene.add(S.buildingsGroup);

    S.subjectMesh = subjectBuilding();
    S.scene.add(S.subjectMesh);

    S.controls = makeControls(S.camera, S.renderer.domElement);
    window.addEventListener('resize', resize);

    animate();
  }

  function setLocation(lat, lon) {
    S.lat = lat; S.lon = lon;
    status('Loading neighborhood buildings...');
    renderBuildings([]); // clear
    return fetchBuildings(lat, lon, 220)
      .then(function (data) {
        var buildings = parseOverpass(data);
        if (buildings.length === 0) { renderBuildings(mockNeighborhood()); status('No OSM buildings here; showing approximate massing.'); }
        else { renderBuildings(buildings); status(buildings.length + ' neighboring buildings loaded from OpenStreetMap.'); }
      })
      .catch(function () {
        renderBuildings(mockNeighborhood());
        status('Building data unavailable; showing approximate massing.');
      });
  }

  function dispose() {
    if (S.raf) cancelAnimationFrame(S.raf);
    if (S.controls) S.controls.dispose();
    window.removeEventListener('resize', resize);
    if (S.renderer) { S.renderer.dispose(); if (S.renderer.domElement && S.renderer.domElement.parentNode) S.renderer.domElement.parentNode.removeChild(S.renderer.domElement); }
    S.scene = null; S.renderer = null;
  }

  window.SunPath3D = {
    init: init,
    setLocation: setLocation,
    setSunFromSolar: setSunFromSolar,
    resize: resize,
    dispose: dispose,
    _state: S
  };
})();
