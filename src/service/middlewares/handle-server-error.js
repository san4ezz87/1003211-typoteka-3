'use strict';

const {HttpCode} = require(`../constants`);

module.exports = (logger) => (err, req, res, next) => {
  if (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).end(`500`);
    logger.error(`An error occured on processing request: ${err.message}`);
  }
  next();
};
