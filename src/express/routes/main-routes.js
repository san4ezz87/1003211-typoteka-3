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

router.get(`/search`, (req, res) => {
  res.render(`search`);
});

router.get(`/categories`, (req, res) => {
  res.render(`all-categories`);
});

module.exports = router;


