'use strict';

const path = require(`path`);
const express = require(`express`);
const app = express();
const {HttpCode} = require(`../utils/httpCodes`);

const APPLICATION_PORT = process.env.PORT || 8080;

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRouters = require(`./routes/articles-routers`);

app.set(`view engine`, `pug`);
app.set(`views`, path.resolve(__dirname + `/templates`));

app.use(express.static(path.resolve(__dirname + `/public`)));

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRouters);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).render(`errors/404`);
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
  }
  next();
});

app.listen(APPLICATION_PORT, () => {
  console.log(`Example app listening at http://localhost:${APPLICATION_PORT}`);
});
