'use strict';

const path = require(`path`);
const express = require(`express`);
const app = express();
const {HttpCode} = require(`./constants.js`);

const APPLICATION_PORT = process.env.PORT || 8080;

const PUBLIC_DIR = `/public`;
const UPLOAD_DIR = `/upload`;

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRouters = require(`./routes/articles-routers`);

const {getLogger} = require(`./logger`);

const logger = getLogger({name: `templates`});

app.set(`view engine`, `pug`);
app.set(`views`, path.resolve(__dirname + `/templates`));


app.use(express.urlencoded());

app.use(express.static(path.resolve(__dirname + PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname + UPLOAD_DIR)));

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);

  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });

  next();
});

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRouters);

app.use((req, res) => {
  logger.error(`Route not found: ${req.url}`);
  res.status(HttpCode.NOT_FOUND).render(`errors/404`);
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
    logger.error(`An error occured on processing request: ${err.message}`);
  }
  next();
});

app.listen(APPLICATION_PORT, () => {
  console.log(`Example app listening at http://localhost:${APPLICATION_PORT}`);
});
