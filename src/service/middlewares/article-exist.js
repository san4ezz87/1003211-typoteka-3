'use strict';

const {HttpCode} = require(`../constants`);

module.exports = (articleService) => (req, res, next) => {
  const {articleId} = req.params;
  const article = articleService.findOne(articleId);

  if (!article) {
    res.status(HttpCode.NOT_FOUND).send(`Article with ${articleId} not found`);
    return null;
  }

  res.locals.article = article;

  return next();
};
