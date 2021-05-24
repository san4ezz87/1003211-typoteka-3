'use strict';

const fs = require(`fs`).promises;

const path = require(`path`);

const FILENAME = `mocks.json`;
const preparePath = (url) => path.resolve(__dirname, `../../../`, url);

let data = null;

module.exports.getMockData = async () => {
  if (data !== null) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.readFile(preparePath(FILENAME));
    data = JSON.parse(fileContent);
  } catch (err) {
    return Promise.reject(err);
  }

  return Promise.resolve(data);
};

