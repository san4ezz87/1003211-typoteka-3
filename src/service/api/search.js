"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../constants`);

const route = new Router();

module.exports = (app, searchService) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const { query } = req.query;
    if (!query) {
      res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
      return;
    }

    const articles = await searchService.search(query);

    if (!articles) {
      res.status(HttpCode.NOT_FOUND).send(`Not found  with query ${query}`);
      return;
    }

    res.status(HttpCode.OK).json(articles);
  });
};
