"use strict";

const { getRandomNumber } = require(`./getRandomNumber`);
const { shuffle } = require(`./shuffle`);
const { generateDate, formatDate } = require(`./generateDate`);
const { getStaticFromFile } = require(`./getStaticFromFile`);
const { writeFile } = require(`./writeFile`);
const { ensureArray } = require(`./ensureArray`);
const { prepareErrors } = require(`./prepareErrors`);

module.exports = {
  getRandomNumber,
  shuffle,
  generateDate,
  formatDate,
  getStaticFromFile,
  writeFile,
  ensureArray,
  prepareErrors,
};
