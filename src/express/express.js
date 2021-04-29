'use strict';

const express = require(`express`);
const app = express();
const APPLICATION_PORT = process.env.PORT || 8080;

const mainRoutes = require(`./routes/mainRoutes`);
const myRoutes = require(`./routes/myRoutes`);
const articlesRouters = require(`./routes/articlesRouters`);

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRouters);

app.listen(APPLICATION_PORT, () => {
  console.log(`Example app listening at http://localhost:${APPLICATION_PORT}`)
});
