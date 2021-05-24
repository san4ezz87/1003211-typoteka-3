'use strict';

const {Router} = require(`express`);
const {getMockData} = require(`../lib/get-mock-data`);

const articles = require(`./articles`);
const category = require(`./category`);
const search = require(`./search`);

const {
  ArticlesService,
  CategoriesService,
  SearchService,
} = require(`../data-service`);


const app = new Router();

(async () => {
  try {
    const mockData = await getMockData();

    articles(app, new ArticlesService(mockData));
    category(app, new CategoriesService(mockData));
    search(app, new SearchService(mockData));
  } catch (err) {
    console.log('err in get data', err);
  }

})();

module.exports = app;
