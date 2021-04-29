'use strict';

const express = require(`express`);
const router = new express.Router();

router.get(`/`, (req, res) => {
  res.setHeader(`content-type`, `text/plain`);
  res.send(req.originalUrl);
});

router.get(`/register`, (req, res) => {
  res.setHeader(`content-type`, `text/plain`);
  res.send(req.originalUrl);
});

router.get(`/login`, (req, res) => {
  res.setHeader(`content-type`, `text/plain`);
  res.send(req.originalUrl);
});

router.get(`/search`, (req, res) => {
  res.setHeader(`content-type`, `text/plain`);
  res.send(req.originalUrl);
});

router.get(`/categories`, (req, res) => {
  res.setHeader(`content-type`, `text/plain`);
  res.send(req.originalUrl);
});

module.exports = router;


