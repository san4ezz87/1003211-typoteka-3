"use strict";

const fs = require(`fs`).promises;

module.exports.writeFile = async (filename, content, logger) => {
  try {
    await fs.writeFile(filename, content);
  } catch (e) {
    logger.error(`Не удалось записать файл ${filename}!`);
    return process.exit(1);
  }

  logger.info(`Файл ${filename} успешно записан!`);
  return process.exit(0);
};
