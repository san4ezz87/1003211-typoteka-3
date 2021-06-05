'use strict';

const express = require(`express`);
const app = express();
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `api`});

const {
  API_PREFIX,
  DEFAULT_PORT,
  HttpCode,
} = require(`../constants`);

app.use(express.json());

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).end(`404`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).end(`500`);
    logger.error(`An error occured on processing request: ${err.message}`);
  }
  next();
});

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);

  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });

  next();
});

module.exports = {
  name: `--server`,
  run([customPort]) {
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`An error occured on server creation: ${err.message}`);
        }
        return logger.info(`Listening at http://localhost:${port}`);
      });
    } catch (err) {
      logger.info(`An error occured: ${err.message}`);
    }
  }
};
