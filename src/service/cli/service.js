'use strict';

const express = require(`express`);
const app = express();
const routes = require(`../api`);

const {
  API_PREFIX,
  DEFAULT_PORT,
  HttpCode,
} = require(`../constants`);

app.use(express.json());

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).end(`404`);
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).end(`500`);
  }
  next();
});

module.exports = {
  name: `--server`,
  run([customPort]) {
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  }
};
