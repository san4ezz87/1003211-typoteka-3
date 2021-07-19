'use strict';

const {getRandomNumber} = require(`./getRandomNumber`);
const {shuffle} = require(`./shuffle`);
const {generateDate, formatDate} = require(`./generateDate`);
const {getStaticFromFile} = require(`./getStaticFromFile`);
const {writeFile} = require(`./writeFile`);

module.exports = {
  getRandomNumber,
  shuffle,
  generateDate,
  formatDate,
  getStaticFromFile,
  writeFile,
};
