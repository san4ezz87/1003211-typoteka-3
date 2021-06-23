'use strict';

const {HttpCode} = require(`../constants`);

module.exports = (logger) => (req, res) => {
  res.status(HttpCode.NOT_FOUND).end(`404`);
  logger.error(`Route not found: ${req.url}`);
};
