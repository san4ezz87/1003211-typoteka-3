'use strict';

const {HttpCode} = require(`../constants`);

module.exports = (logger) => (req, res) => {
  logger.error(`Route not found: ${req.url}`);
  res.status(HttpCode.NOT_FOUND).render(`errors/404`);
};
