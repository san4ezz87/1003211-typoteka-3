'use strict';

const express = require(`express`);
const {getAPI} = require(`../api.js`);
const api = getAPI();

const router = new express.Router();

router.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
});

router.get(`/register`, (req, res) => {
  res.render(`sign-up`);
});

router.get(`/login`, (req, res) => {
  res.render(`login`);
});

router.get(`/search`, async (req, res) => {
  console.log('query search', req.query.search)
  try {
    const searcedArticles = await api.search(req.query.search)
    res.render(`search`, {searcedArticles})
    
  } catch(err) {
    res.render(`search`, {searcedArticles: null})
  }

});

router.get(`/categories`, (req, res) => {
  res.render(`all-categories`);
});

module.exports = router;


