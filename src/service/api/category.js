'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);

const route = new Router();

module.exports = (app, articleService) => {
  app.use(`/category`, route);

  route.get(`/`, (req, res) => {
    const categories = articleService.findAll();

    res.status(HttpCode.OK).json(categories);
  });
}