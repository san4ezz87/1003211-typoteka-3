"use strict";

const { Router } = require(`express`);
const { HttpCode } = require(`../constants`);

const route = new Router();

module.exports = (app, categoriesService) => {
  app.use(`/category`, route);

  route.get(`/`, async (req, res) => {
    const { count } = req.query;
    const categories = await categoriesService.findAll(count);
    res.status(HttpCode.OK).json(categories);
  });
};
