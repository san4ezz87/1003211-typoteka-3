'use strict';

const express = require(`express`);
const app = express();
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const requestResponseLogger = require(`../../common/middlewares/request-response-logger`);

const logger = getLogger({name: `api`});

const {
  API_PREFIX,
  DEFAULT_PORT,
} = require(`../constants`);

const {
  handleServerError,
  handleClientError
} = require(`../middlewares`);

app.use(express.json());

app.use(requestResponseLogger(logger));

app.use(API_PREFIX, routes);


app.use(handleServerError);

app.use(handleClientError);

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
