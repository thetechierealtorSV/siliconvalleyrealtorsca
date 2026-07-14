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

  var SUN_DIST = 500;

  var S = {
    scene: null, camera: null, renderer: null, sunLight: null, hemiLight: null, ambient: null,
    ground: null, buildingsGroup: null, subjectMesh: null, compassGroup: null,
    sunMesh: null, sunGlowMesh: null, sunPathLine: null,
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
    var geo = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: true, bevelThickness: 0.6, bevelSize: 0.6, bevelSegments: 2, curveSegments: 12 });
    geo.rotateX(-Math.PI / 2); // extrude along -Y then flip so it stands up on ground
    geo.translate(0, height, 0);
    var color = isSubject ? 0xf59e0b : 0x9aa6bf;
    var mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.78, metalness: 0.04, flatShading: false });
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
    // A detailed low-poly single-family home: siding walls, pitched gable roof,
    // window & door insets, subtle trim. All original geometry, no textures.
    var group = new THREE.Group();
    var W = 12, D = 10, wallH = 6.2;

    var wallMat = new THREE.MeshStandardMaterial({ color: 0xe7d4b5, roughness: 0.85, metalness: 0.02 });
    var trimMat = new THREE.MeshStandardMaterial({ color: 0xfaf6ef, roughness: 0.7 });
    var roofMat = new THREE.MeshStandardMaterial({ color: 0x6b3a2b, roughness: 0.75, metalness: 0.05 });
    var doorMat = new THREE.MeshStandardMaterial({ color: 0x0f1a2e, roughness: 0.5, metalness: 0.15 });
    var glassMat = new THREE.MeshStandardMaterial({ color: 0x8fb8d8, roughness: 0.25, metalness: 0.35, emissive: 0x1a2a3a, emissiveIntensity: 0.15 });

    // Walls (box)
    var wallGeo = new THREE.BoxGeometry(W * 2, wallH, D * 2);
    var walls = new THREE.Mesh(wallGeo, wallMat);
    walls.position.y = wallH / 2;
    walls.castShadow = true; walls.receiveShadow = true;
    group.add(walls);

    // Foundation trim
    var foundGeo = new THREE.BoxGeometry(W * 2 + 0.4, 0.6, D * 2 + 0.4);
    var found = new THREE.Mesh(foundGeo, trimMat);
    found.position.y = 0.3;
    found.castShadow = true; found.receiveShadow = true;
    group.add(found);

    // Pitched gable roof (triangular prism via ExtrudeGeometry)
    var roofShape = new THREE.Shape();
    var rW = W + 0.6, rH = 3.6;
    roofShape.moveTo(-rW, 0);
    roofShape.lineTo(rW, 0);
    roofShape.lineTo(0, rH);
    roofShape.lineTo(-rW, 0);
    var roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: D * 2 + 1.2, bevelEnabled: false });
    var roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.y = 0; // ridge runs along Z
    roof.position.set(0, wallH, -(D + 0.6));
    roof.castShadow = true; roof.receiveShadow = true;
    group.add(roof);

    // Front door (south face, +Z side)
    var doorGeo = new THREE.BoxGeometry(1.4, 2.6, 0.12);
    var door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 1.3, D + 0.06);
    door.castShadow = true;
    group.add(door);

    // Door frame trim
    var doorFrameGeo = new THREE.BoxGeometry(1.7, 2.9, 0.18);
    var doorFrame = new THREE.Mesh(doorFrameGeo, trimMat);
    doorFrame.position.set(0, 1.45, D + 0.02);
    group.add(doorFrame);
    doorFrame.add(door); // door in front of frame visually; but keep group flat — simpler: keep separate. Revert:
    doorFrame.remove(door);
    group.add(door);

    // Windows on all four facades
    var winW = 1.6, winH = 1.3, winY = 3.4;
    var addWindow = function (x, y, z, rotY) {
      var frameGeo = new THREE.BoxGeometry(winW + 0.35, winH + 0.35, 0.18);
      var frame = new THREE.Mesh(frameGeo, trimMat);
      frame.position.set(x, y, z);
      frame.rotation.y = rotY;
      group.add(frame);
      var paneGeo = new THREE.BoxGeometry(winW, winH, 0.06);
      var pane = new THREE.Mesh(paneGeo, glassMat);
      pane.position.set(x, y, z);
      pane.rotation.y = rotY;
      // nudge pane slightly outward along facade normal
      var nx = Math.sin(rotY), nz = Math.cos(rotY);
      pane.position.x += nx * 0.05;
      pane.position.z += nz * 0.05;
      group.add(pane);
    };
    // South facade (+Z)
    addWindow(-4.5, winY, D + 0.03, 0);
    addWindow( 4.5, winY, D + 0.03, 0);
    // North facade (-Z)
    addWindow(-4.5, winY, -D - 0.03, Math.PI);
    addWindow( 4.5, winY, -D - 0.03, Math.PI);
    // East facade (+X)
    addWindow(W + 0.03, winY, -3.5, Math.PI / 2);
    addWindow(W + 0.03, winY,  3.5, Math.PI / 2);
    // West facade (-X)
    addWindow(-W - 0.03, winY, -3.5, -Math.PI / 2);
    addWindow(-W - 0.03, winY,  3.5, -Math.PI / 2);

    // Soft contact shadow disc under the house (subtle darkening)
    var shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false });
    var shadowGeo = new THREE.CircleGeometry(Math.max(W, D) * 1.6, 48);
    var contact = new THREE.Mesh(shadowGeo, shadowMat);
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = 0.05;
    group.add(contact);

    return group;
  }

  // ---- direction vector (unit) from ground toward sun for given el/az -------
  function sunDirection(elevationDeg, azimuthDeg) {
    var el = elevationDeg * Math.PI / 180;
    var az = azimuthDeg * Math.PI / 180;
    var y = Math.sin(el);
    var horiz = Math.cos(el);
    var x = horiz * Math.sin(az);
    var z = -horiz * Math.cos(az);
    return { x: x, y: y, z: z };
  }

  // ---- position the sun light + visible sun sphere from solar el/az ---------
  function setSunFromSolar(elevationDeg, azimuthDeg) {
    var d = sunDirection(elevationDeg, azimuthDeg);
    var sx = d.x * SUN_DIST, sy = d.y * SUN_DIST, sz = d.z * SUN_DIST;
    // Keep the visible sun above the horizon (never sink into the ground).
    // Uses a smooth floor so sunrise/sunset gracefully skim the horizon line.
    var minY = SUN_DIST * 0.035;
    var visualY = sy < minY ? minY : sy;

    if (S.sunMesh) {
      S.sunMesh.position.set(sx, visualY, sz);
      S.sunMesh.visible = elevationDeg > -8;
      // Warm at horizon, brilliant white-yellow at noon
      var warmMix = Math.max(0, Math.min(1, (elevationDeg + 6) / 40));
      var color = new THREE.Color().lerpColors(new THREE.Color(0xff6b1a), new THREE.Color(0xfff2a8), warmMix);
      S.sunMesh.material.color.copy(color);
    }
    if (S.sunGlowMesh) {
      S.sunGlowMesh.position.set(sx, visualY, sz);
      S.sunGlowMesh.visible = elevationDeg > -8;
      var t = Math.max(0, Math.min(1, elevationDeg / 30));
      S.sunGlowMesh.material.opacity = 0.35 + 0.45 * (1 - t);
    }
    if (S.sunGlowMesh2) {
      S.sunGlowMesh2.position.set(sx, sy, sz);
      S.sunGlowMesh2.visible = elevationDeg > -6;
      S.sunGlowMesh2.material.opacity = 0.12 + 0.25 * (1 - Math.max(0, Math.min(1, elevationDeg / 30)));
    }

    if (elevationDeg <= 0) {
      S.sunLight.intensity = 0.0;
      // Keep meaningful ambient/hemi so buildings never disappear into black.
      S.hemiLight.intensity = 0.6;
      if (S.ambient) S.ambient.intensity = 0.35;
    } else {
      S.sunLight.position.set(sx, sy, sz);
      S.sunLight.target.position.set(0, 0, 0);
      S.sunLight.target.updateMatrixWorld();
      var warm = Math.max(0, Math.min(1, elevationDeg / 25));
      S.sunLight.intensity = 0.5 + 0.7 * Math.min(1, elevationDeg / 40);
      S.hemiLight.intensity = 0.55 + 0.25 * warm;
      if (S.ambient) S.ambient.intensity = 0.28;
    }
  }

  // ---- build/refresh the sun-path arc from a day's samples -----------------
  function setDayPath(samples) {
    if (!S.scene || !samples || !samples.length) return;
    var pts = [];
    var pathDist = SUN_DIST * 0.98;
    for (var i = 0; i < samples.length; i++) {
      var s = samples[i];
      if (s.elevation < 0) continue;
      var d = sunDirection(s.elevation, s.azimuth);
      pts.push(new THREE.Vector3(d.x * pathDist, d.y * pathDist, d.z * pathDist));
    }
    if (S.sunPathLine) {
      S.scene.remove(S.sunPathLine);
      if (S.sunPathLine.geometry) S.sunPathLine.geometry.dispose();
      if (S.sunPathLine.material) S.sunPathLine.material.dispose();
      S.sunPathLine = null;
    }
    if (pts.length < 2) return;
    var geo = new THREE.BufferGeometry().setFromPoints(pts);
    var mat = new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.85 });
    S.sunPathLine = new THREE.Line(geo, mat);
    S.scene.add(S.sunPathLine);
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
    // Soft sky gradient backdrop (canvas texture) instead of a flat void.
    (function () {
      var cvs = document.createElement('canvas');
      cvs.width = 4; cvs.height = 256;
      var ctx = cvs.getContext('2d');
      var g = ctx.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0.00, '#4b7bd6');
      g.addColorStop(0.55, '#a9c4ec');
      g.addColorStop(0.85, '#fde7c1');
      g.addColorStop(1.00, '#f5b478');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 4, 256);
      var tex = new THREE.CanvasTexture(cvs);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      S.scene.background = tex;
    })();

    var w = container.clientWidth || 600, h = container.clientHeight || 460;
    S.camera = new THREE.PerspectiveCamera(50, w / h, 1, 5000);

    S.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    S.renderer.outputEncoding = THREE.sRGBEncoding;
    S.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    S.renderer.toneMappingExposure = 1.05;
    S.renderer.physicallyCorrectLights = true;
    S.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    S.renderer.setSize(w, h, false);
    S.renderer.shadowMap.enabled = true;
    S.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(S.renderer.domElement);

    S.hemiLight = new THREE.HemisphereLight(0xbcd0ff, 0x2b2410, 0.55);
    S.ambient = new THREE.AmbientLight(0x8ea0c0, 0.18);
    S.scene.add(S.ambient);
    S.scene.add(S.hemiLight);

    S.sunLight = new THREE.DirectionalLight(0xfff3d6, 1.0);
    S.sunLight.castShadow = true;
    S.sunLight.shadow.mapSize.width = 4096;
    S.sunLight.shadow.mapSize.height = 4096;
    S.sunLight.shadow.radius = 4;
    S.sunLight.shadow.bias = -0.0004;
    S.sunLight.shadow.normalBias = 0.5;
    var c = S.sunLight.shadow.camera;
    c.left = -300; c.right = 300; c.top = 300; c.bottom = -300; c.near = 1; c.far = 1200;
    S.scene.add(S.sunLight);
    S.scene.add(S.sunLight.target);

    var groundGeo = new THREE.PlaneGeometry(1600, 1600);
    groundGeo.rotateX(-Math.PI / 2);
    var groundMat = new THREE.MeshStandardMaterial({ color: 0x5c7250, roughness: 0.98, metalness: 0.0 });
    S.ground = new THREE.Mesh(groundGeo, groundMat);
    S.ground.receiveShadow = true;
    S.scene.add(S.ground);

    S.compassGroup = compass();
    S.scene.add(S.compassGroup);

    S.buildingsGroup = new THREE.Group();
    S.scene.add(S.buildingsGroup);

    S.subjectMesh = subjectBuilding();
    S.scene.add(S.subjectMesh);

    // Visible sun sphere + two soft glow halos for a Redfin-style bright sun
    var sunGeo = new THREE.SphereGeometry(28, 40, 40);
    var sunMat = new THREE.MeshBasicMaterial({ color: 0xffe27a });
    S.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    S.scene.add(S.sunMesh);

    var glowGeo = new THREE.SphereGeometry(48, 40, 40);
    var glowMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.4, depthWrite: false });
    S.sunGlowMesh = new THREE.Mesh(glowGeo, glowMat);
    S.scene.add(S.sunGlowMesh);

    var glow2Geo = new THREE.SphereGeometry(85, 40, 40);
    var glow2Mat = new THREE.MeshBasicMaterial({ color: 0xfde68a, transparent: true, opacity: 0.18, depthWrite: false });
    S.sunGlowMesh2 = new THREE.Mesh(glow2Geo, glow2Mat);
    S.scene.add(S.sunGlowMesh2);

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
    setDayPath: setDayPath,
    resize: resize,
    dispose: dispose,
    _state: S
  };
})();
