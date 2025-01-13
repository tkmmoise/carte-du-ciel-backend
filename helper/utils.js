const PI = Math.PI;
const SIN = Math.sin;
const COS = Math.cos;
const TAN = Math.tan;
const ASIN = Math.asin;
const ATAN = Math.atan2;
const ACOS = Math.acos;
const RAD = PI / 180;


const DAY_MS = 1000 * 60 * 60 * 24;
const J1970 = 2440588;
const J2000 = 2451545;


/* Function to convert a date to Julian Date */
const toJulian = (date) => {
  return date.valueOf() / DAY_MS - 0.5 + J1970;
};

/* Function to convert a Julian Date to a date */
const fromJulian = (julian) => {
  return new Date((julian + 0.5 - J1970) * DAY_MS);
}

/* Function to convert a date to days since J2000 */
const toDays = (date) => {
  return toJulian(date) - J2000;
};

/* Function to calculate the solar mean anomaly */
const siderealTime = (d, lw) => {
  return RAD * (280.16 + 360.9856235 * d) - lw;
};

/* Function to calculate the solar declination */
const azimuth = (H, phi, dec) => {
  return ATAN(SIN(H), COS(H) * SIN(phi) - TAN(dec) * COS(phi));
};

const altitude = (H, phi, dec) => {
  return ASIN(SIN(phi) * SIN(dec) + COS(phi) * COS(dec) * COS(H));
};

/* Function to calculate the solar declination */
const getPosition = (star, date, lat, lng) => {
  const lw = RAD * -lng;
  const phi = RAD * lat;
  const d = toDays(date);
  const c = star;
  const H = siderealTime(d, lw) - c.ra;
  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: altitude(H, phi, c.dec),
  };
}

/* Function to calculate the position of a star */
const coordsToPoints = (coordinate, radius) => {
  const deg2Rad = Math.PI / 180;
  const phi = (90 - coordinate.lat) * deg2Rad;
  const theta = (coordinate.lng + 180) * deg2Rad;
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return {
    x,
    y,
    z,
  };
};

module.exports = { getPosition, coordsToPoints };