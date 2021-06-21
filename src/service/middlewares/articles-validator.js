'use strict';

const {HttpCode} = require(`../constants`);

const articleKeys = [`title`, `announce`, `fullText`, `category`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = articleKeys.every((key) => keys.includes(key));

  const equaleLength = articleKeys.length <= keys.length;
  if (!keysExists || !equaleLength) {
    res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
    return null;
  }
  return next();
};
