'use strict';

const {HttpCode} = require(`../constants`);

const articleCommentKeys = [`text`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = articleCommentKeys.every((key) => keys.includes(key));

  const equaleLength = articleCommentKeys.length === keys.length;

  if (!keysExists || !equaleLength) {
    res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
    return null;
  }
  next();
};
