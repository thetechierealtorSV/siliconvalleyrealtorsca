/*
SunPath IQ - Solar Position and Daylight Engine
Original, self-authored NOAA-based solar position algorithm.
Validated against reference values for Palo Alto, CA:
summer solstice solar noon elevation approx 76 deg (due south)
winter solstice solar noon elevation approx 29 deg (due south)
No external astronomy libraries used.
*/

function solarPosition(date, lat, lon) {
  const rad = Math.PI / 180, deg = 180 / Math.PI;
  const jd = date.getTime() / 86400000 + 2440587.5;
  const n = jd - 2451545.0;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * rad;
  const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * rad;
  const eps = (23.439 - 0.0000004 * n) * rad;
  const decl = Math.asin(Math.sin(eps) * Math.sin(lambda));
  const y = Math.tan(eps / 2) ** 2;
  const Lr = L * rad;
  const eqTime = 4 * deg * (y * Math.sin(2 * Lr) - 2 * 0.0167 * Math.sin(g) + 4 * 0.0167 * y * Math.sin(g) * Math.cos(2 * Lr) - 0.5 * y * y * Math.sin(4 * Lr) - 1.25 * 0.0167 * 0.0167 * Math.sin(2 * g));
  const minutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
  const t = (minutes + eqTime + 4 * lon) % 1440;
  let ha = (t / 4 - 180) * rad;
  const latR = lat * rad;
  const elev = Math.asin(Math.sin(latR) * Math.sin(decl) + Math.cos(latR) * Math.cos(decl) * Math.cos(ha));
  let az = Math.atan2(-Math.sin(ha), Math.tan(decl) * Math.cos(latR) - Math.sin(latR) * Math.cos(ha));
  az = (az * deg + 360) % 360;
  return { elevation: +(elev * deg).toFixed(2), azimuth: +az.toFixed(2) };
}
