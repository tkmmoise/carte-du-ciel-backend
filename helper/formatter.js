const { getPosition, coordsToPoints } = require("./utils.js");

const RADIUS = 200;


const parseStar = (star) => {
  return {
    id: star.id,
    hr: parseInt(star.hr) || null,
    bf: star.bf,
    proper: star.proper || null,
    ra: parseFloat(star.ra),
    dec: parseFloat(star.dec),
    mag: parseFloat(star.mag),
    ci: parseFloat(star.ci),
    lum: parseFloat(star.lum),
    dist: parseFloat(star.dist),
    x: parseFloat(star.x),
    y: parseFloat(star.y),
    z: parseFloat(star.z),
    con: star.con || null,
  };
}

const formatStar = (star) => {
  const rightAscension = star.ra;
  const declination = star.dec;

  const longitude = (rightAscension * 360) / 24 - 180;
  const latitude = declination;

  const { azimuth, altitude } = getPosition(star, new Date(), latitude, longitude);
  const point = coordsToPoints({ lat: latitude, lng: longitude }, RADIUS);

  return {
    ...point,
    ra: star.ra,
    dec: star.dec,
    mag: star.mag,
    ci: star.ci,
    lum: star.lum,
    dist: star.dist,
    bf: star.bf,
    hr: star.hr,
    proper: star.proper,
    az: azimuth,
    alt: altitude,
    con: star.con,
  }
}

module.exports = { parseStar, formatStar };