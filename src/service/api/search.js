'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);

const route = new Router();

module.exports = (app, articleService) => {
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const query = req.query.query;

    const articles = articleService.search(query);

    if (!articles) {
      res.status(HttpCode.NOT_FOUND).send(`Not found  with query ${query}`);
      return;
    }

    res.status(HttpCode.OK).json(articles);
  });
};
