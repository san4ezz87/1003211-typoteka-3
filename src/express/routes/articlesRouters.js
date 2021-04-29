'use strict';

const {Router} = require(`express`);
const router = new Router();


router.get(`/category/:id`, (req, res) => {
  res.setHeader(`content-type`, `text/plain`);
  res.send(req.originalUrl);
});

router.get(`/add`, (req, res) => {
  res.setHeader(`content-type`, `text/plain`);
  res.send(req.originalUrl);
});

router.get(`/edit/:id`, (req, res) => {
  res.setHeader(`content-type`, `text/plain`);
  res.send(req.originalUrl);
});

router.get(`/:id`, (req, res) => {
  res.setHeader(`content-type`, `text/plain`);
  res.send(req.originalUrl);
});

module.exports = router;
