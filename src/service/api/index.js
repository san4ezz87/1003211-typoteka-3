'use strict';

const {Router} = require(`express`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const articles = require(`./articles`);
const category = require(`./category`);
const search = require(`./search`);

const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `api`});

const {
  ArticlesService,
  CategoriesService,
  SearchService,
  CommentService,
} = require(`../data-service`);


const app = new Router();

(async () => {
  try {
    defineModels(sequelize)
    articles(app, new ArticlesService(sequelize), new CommentService(sequelize));
    category(app, new CategoriesService(sequelize));
    search(app, new SearchService(sequelize));
  } catch (err) {
    logger.error(`Couldn't init services or read data ${err.message}`);
  }

})();

module.exports = app;
