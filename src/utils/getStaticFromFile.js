'use strict';

const fs = require(`fs`).promises;

module.exports.getStaticFromFile = async (url, logger) => {
  try {
    const data = await fs.readFile(url, `utf8`);
    return data.split(`\n`);
  } catch (e) {
    logger.error(`Не удалось прочитать файл ${url}`);
    return [];
  }
};