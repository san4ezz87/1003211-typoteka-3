'use strict';
const chalk = require(`chalk`);

const packageJson = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    const version = packageJson.version;
    console.info(chalk.blue(version));
  }
};
