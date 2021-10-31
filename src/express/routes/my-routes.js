'use strict';

const {Router} = require(`express`);
const router = new Router();
const {getAPI} = require(`../api.js`);
const api = getAPI();

router.get(`/`, async (req, res) => {
  const articles = await api.getArticles({comments: false});
  res.render(`my`, {articles});
});

router.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  res.render(`comments`, {articles: articles.slice(0, 3)});
});

module.exports = router;
