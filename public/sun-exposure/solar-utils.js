/*
  SunPath IQ - Solar Utilities & Daylight Score
  ------------------------------------------------
  Original, self-authored helper layer built on top of solar-engine.js
  (the validated NOAA-based solarPosition(date, lat, lon) engine).

  This module provides:
    - solarMinutesToHHMM(min): format minutes-since-solar-midnight as solar time.
    - sunPathDay(date, lat, lon): samples the sun's elevation/azimuth across one
      LOCAL SOLAR day and returns sunrise/sunset/solar-noon in TRUE SOLAR TIME
      plus day length.
    - daylightScore(...): an ORIGINAL 0-100 "Daylight Score" heuristic.

  === Daylight Score: ORIGINAL heuristic ===
  NOT derived from, and NOT a re-implementation of, any third-party algorithm.
  This is NOT Redfin "Sunscore", NOT Shadowmap, and shares no code or formula
  with them. It is our own transparent, tunable blend defined entirely below.

  The score is the sum of three independent, physically-motivated components,
  each normalized to its own point sub-range and floored at 0:

    * Day Length    (0-40 pts): usable daylight hours.
                    Linear map 9h -> 0 pts, 15h -> 40 pts.
    * Peak Altitude (0-30 pts): solar-noon elevation (light directness/strength).
                    Linear map 0deg -> 0 pts, 99deg -> 30 pts.
    * Orientation   (0-30 pts): how well the facade/wall azimuth faces the sun
                    at solar noon. max(0, cos(delta-azimuth)) * 30. Best when
                    the wall faces the equator (~180deg/south in N. hemisphere).

  Total = clamp(dayLength + altitude + orientation, 0, 100). Every component
  uses Math.max(0, ...) so none can drag the total negative. Weights and
  breakpoints are our own editorial choices for real-estate daylight
  desirability; documented here so the score is transparent and reproducible.

  Reference validation (Palo Alto 37.4419, -122.143, 2026, south wall az 180):
    summer solstice: sunrise 4:44 / sunset 19:19 / 14.59h / noon 75.99deg
                     Score 90 { dayLength 37, altitude 23, orientation 30 }
    winter solstice: sunrise 7:16 / sunset 16:41 / 9.42h / noon 29.12deg
  (all times are TRUE SOLAR TIME).
*/

// TRUE SOLAR TIME helpers ---------------------------------------------------

// Convert minutes-from-solar-midnight to an "H:MM" solar-time string.
function solarMinutesToHHMM(min) {
  min = ((min % 1440) + 1440) % 1440;
  var h = Math.floor(min / 60);
  var m = Math.round(min % 60);
  if (m === 60) { m = 0; h = (h + 1) % 24; }
  return h + ':' + (m < 10 ? '0' + m : m);
}

/*
  sunPathDay(date, lat, lon)
  Samples elevation & azimuth every SAMPLE_MIN minutes across ONE local solar
  day and derives sunrise / sunset / solar noon in TRUE SOLAR TIME.

  BUGFIX (documented): a naive implementation scanned a single UTC calendar
  day. For the western hemisphere in summer, local daylight straddles UTC
  midnight, which produced a NEGATIVE day length. FIX: anchor the scan window
  to LOCAL SOLAR midnight using the longitude offset, capture the first
  sunrise, then the first subsequent sunset.
*/
function sunPathDay(date, lat, lon) {
  var SAMPLE_MIN = 2;

  // Longitude -> minutes offset from UTC (solar). West longitude is negative.
  var lonOffsetMin = -lon / 15 * 60;
  var startMin = ((lonOffsetMin % 1440) + 1440) % 1440;

  var y = date.getUTCFullYear();
  var m = date.getUTCMonth();
  var d = date.getUTCDate();
  // Local solar midnight expressed as a UTC timestamp.
  var dayStartMs = Date.UTC(y, m, d, 0, 0, 0) + startMin * 60000;

  var samples = [];
  var sunriseMin = null, sunsetMin = null;
  var noonMin = null, noonElev = -90, noonAz = 180;
  var prevElev = null;

  for (var t = 0; t <= 1440; t += SAMPLE_MIN) {
    var when = new Date(dayStartMs + t * 60000);
    var p = solarPosition(when, lat, lon);
    samples.push({ min: t, elevation: p.elevation, azimuth: p.azimuth });

    if (p.elevation > noonElev) { noonElev = p.elevation; noonAz = p.azimuth; noonMin = t; }

    if (prevElev !== null) {
      // rising crossing of the horizon -> sunrise (first one)
      if (sunriseMin === null && prevElev < 0 && p.elevation >= 0) {
        sunriseMin = t - SAMPLE_MIN * (p.elevation / (p.elevation - prevElev));
      }
      // falling crossing after sunrise -> sunset (first subsequent one)
      if (sunriseMin !== null && sunsetMin === null && prevElev >= 0 && p.elevation < 0) {
        sunsetMin = t - SAMPLE_MIN * (p.elevation / (p.elevation - prevElev));
      }
    }
    prevElev = p.elevation;
  }

  var dayLengthH = (sunriseMin !== null && sunsetMin !== null)
    ? (sunsetMin - sunriseMin) / 60 : 0;

  return {
    samples: samples,
    sunriseMin: sunriseMin,
    sunsetMin: sunsetMin,
    noonMin: noonMin,
    sunrise: sunriseMin !== null ? solarMinutesToHHMM(sunriseMin) : null,
    sunset: sunsetMin !== null ? solarMinutesToHHMM(sunsetMin) : null,
    solarNoon: noonMin !== null ? solarMinutesToHHMM(noonMin) : null,
    noonElevation: +noonElev.toFixed(2),
    noonAzimuth: +noonAz.toFixed(2),
    dayLengthHours: +dayLengthH.toFixed(2)
  };
}

// DAYLIGHT SCORE (original heuristic) --------------------------------------

// wallAzimuth: compass bearing (deg) the facade/wall faces. 180 = due south.
function daylightScore(dayLengthHours, noonElevation, noonAzimuth, wallAzimuth) {
  if (typeof wallAzimuth !== 'number') wallAzimuth = 180;

  // Day Length: 9h -> 0 pts, 15h -> 40 pts.
  var dayComp = (dayLengthHours - 9) / (15 - 9) * 40;
  dayComp = Math.max(0, Math.min(40, dayComp));

  // Peak Altitude: 0deg -> 0 pts, 99deg -> 30 pts.
  var altComp = noonElevation / 99 * 30;
  altComp = Math.max(0, Math.min(30, altComp));

  // Orientation: how well the wall faces the sun at solar noon.
  var dAz = Math.abs(((wallAzimuth - noonAzimuth + 540) % 360) - 180);
  var orientComp = Math.cos(dAz * Math.PI / 180);
  orientComp = Math.max(0, orientComp) * 30;

  var total = Math.max(0, Math.min(100, dayComp + altComp + orientComp));

  return {
    score: Math.round(total),
    components: {
      dayLength: Math.round(dayComp),
      altitude: Math.round(altComp),
      orientation: Math.round(orientComp)
    }
  };
}

// Expose as globals (loaded via <script src> alongside solar-engine.js).
if (typeof window !== 'undefined') {
  window.sunPathDay = sunPathDay;
  window.daylightScore = daylightScore;
  window.solarMinutesToHHMM = solarMinutesToHHMM;
}
