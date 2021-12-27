"use strict";

const express = require(`express`);
const { prepareErrors } = require("../../utils/prepareErrors.js");
const { getAPI } = require(`../api.js`);
const api = getAPI();

const { upload } = require(`../middlewares`);
const router = new express.Router();

const OFFERS_PER_PAGE = 8;

router.get(`/`, async (req, res) => {
  let { page = 1 } = req.query;
  page = +page;
  const limit = OFFERS_PER_PAGE;

  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [{ count, articles }, categories] = await Promise.all([
    api.getArticles({ limit, offset, comments: true }),
    api.getCategories(true),
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main`, { page, totalPages, articles, categories });
});

router.get(`/register`, (req, res) => {
  res.render(`sign-up`);
});

router.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const { body, file } = req;

  const userData = {
    avatar: file ? file.filename : ``,
    name: body[`name`],
    email: body[`email`],
    password: body[`password`],
    passwordRepeated: body[`repeat-password`],
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`sign-up`, { validationMessages });
  }
});

router.get(`/login`, (req, res) => {
  res.render(`login`);
});

router.get(`/search`, async (req, res) => {
  try {
    const searcedArticles = await api.search(req.query.search);
    res.render(`search`, { searcedArticles });
  } catch (err) {
    res.render(`search`, { searcedArticles: null });
  }
});

router.get(`/categories`, (req, res) => {
  res.render(`all-categories`);
});

module.exports = router;
