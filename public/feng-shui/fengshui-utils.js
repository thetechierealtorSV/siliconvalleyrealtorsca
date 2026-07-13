/*
  Feng Shui IQ - scoring & tradition mapping utilities
  ----------------------------------------------------
  Original vanilla JS. Two directional traditions:
    - Chinese Bagua Compass-school (8 guas mapped to facing degrees)
    - Indian Vastu Shastra (8 directions + Brahmasthan center)
*/

// ---------- Bagua (Compass School) ----------
// Each gua covers 45 degrees, centered on the cardinal/ordinal.
var BAGUA = [
  { name: 'Kan',  english: 'North',     element: 'Water', lifeArea: 'career and life path',            quality: 'good',    center: 0   },
  { name: 'Gen',  english: 'Northeast', element: 'Earth', lifeArea: 'knowledge and self-cultivation',  quality: 'neutral', center: 45  },
  { name: 'Zhen', english: 'East',      element: 'Wood',  lifeArea: 'family and new beginnings',       quality: 'good',    center: 90  },
  { name: 'Xun',  english: 'Southeast', element: 'Wood',  lifeArea: 'wealth and abundance',            quality: 'excellent', center: 135 },
  { name: 'Li',   english: 'South',     element: 'Fire',  lifeArea: 'fame and recognition',            quality: 'excellent', center: 180 },
  { name: 'Kun',  english: 'Southwest', element: 'Earth', lifeArea: 'love, marriage and relationships',quality: 'good',    center: 225 },
  { name: 'Dui',  english: 'West',      english2: 'West', element: 'Metal', lifeArea: 'children and creativity', quality: 'neutral', center: 270 },
  { name: 'Qian', english: 'Northwest', element: 'Metal', lifeArea: 'helpful people and travel',       quality: 'good',    center: 315 }
];

function baguaForFacing(deg) {
  var d = ((deg % 360) + 360) % 360;
  var idx = Math.round(d / 45) % 8;
  return BAGUA[idx];
}

function sittingGuaFor(facingDeg) {
  return baguaForFacing(facingDeg + 180);
}

// ---------- Vastu Shastra ----------
var VASTU = [
  { name: 'Uttara',    english: 'North',     deity: 'Kubera',   quality: 'auspicious',      note: 'wealth and prosperity; good for entrances and cash storage', center: 0   },
  { name: 'Ishanya',   english: 'Northeast', deity: 'Ishvara',  quality: 'highly auspicious', note: 'the most sacred direction; ideal for entrances, prayer rooms, and open space', center: 45  },
  { name: 'Purva',     english: 'East',      deity: 'Indra',    quality: 'auspicious',      note: 'sunrise and vitality; excellent for main entrance and windows', center: 90  },
  { name: 'Agneya',    english: 'Southeast', deity: 'Agni',     quality: 'fire zone',       note: 'ruled by fire; ideal for the kitchen, not for bedrooms', center: 135 },
  { name: 'Dakshina',  english: 'South',     deity: 'Yama',     quality: 'caution',         note: 'heavy and grounding; suitable for storage, not for main entrances', center: 180 },
  { name: 'Nairutya',  english: 'Southwest', deity: 'Nairitya', quality: 'inauspicious for entrance', note: 'heaviest zone; ideal for master bedroom, avoid for main door', center: 225 },
  { name: 'Paschima',  english: 'West',      deity: 'Varuna',   quality: 'neutral',         note: 'stability; suitable for dining and children\u2019s rooms', center: 270 },
  { name: 'Vayavya',   english: 'Northwest', deity: 'Vayu',     quality: 'variable',        note: 'ruled by wind; suitable for guest rooms and movement', center: 315 }
];

function vastuForFacing(deg) {
  var d = ((deg % 360) + 360) % 360;
  var idx = Math.round(d / 45) % 8;
  return VASTU[idx];
}

// ---------- Scoring ----------
function baguaScore(gua) {
  switch (gua.quality) {
    case 'excellent': return 30;
    case 'good':      return 24;
    case 'neutral':   return 18;
    default:          return 12;
  }
}

function vastuScore(v) {
  switch (v.quality) {
    case 'highly auspicious':          return 30;
    case 'auspicious':                 return 26;
    case 'fire zone':                  return 18; // fine unless it's the entrance
    case 'neutral':                    return 18;
    case 'variable':                   return 16;
    case 'caution':                    return 10;
    case 'inauspicious for entrance':  return 6;
    default:                           return 12;
  }
}

function flowScore(q) {
  // q = { stairs, bedroom, kitchen, center }
  var s = 25;
  if (q.stairs === 'yes') s -= 8;
  if (q.bedroom === 'partial') s -= 4;
  else if (q.bedroom === 'no') s -= 9;
  if (q.kitchen === 'neutral') s -= 3;
  else if (q.kitchen === 'bad') s -= 7;
  if (q.center === 'neutral') s -= 3;
  else if (q.center === 'heavy') s -= 8;
  return Math.max(0, s);
}

function shaScore(q) {
  return q.tjunction === 'yes' ? 3 : 15;
}

function harmonyScore(facingDeg, q) {
  var gua = baguaForFacing(facingDeg);
  var v   = vastuForFacing(facingDeg);
  var b = baguaScore(gua);
  var vs = vastuScore(v);
  var f  = flowScore(q);
  var sh = shaScore(q);
  var total = b + vs + f + sh;
  return {
    total: Math.max(0, Math.min(100, Math.round(total))),
    components: { bagua: b, vastu: vs, flow: f, sha: sh },
    gua: gua,
    sitting: sittingGuaFor(facingDeg),
    vastu: v
  };
}

// Expose
window.FengShuiUtils = {
  BAGUA: BAGUA,
  VASTU: VASTU,
  baguaForFacing: baguaForFacing,
  sittingGuaFor: sittingGuaFor,
  vastuForFacing: vastuForFacing,
  harmonyScore: harmonyScore
};
