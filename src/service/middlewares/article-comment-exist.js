'use strict';

const {HttpCode} = require(`../constants`);

module.exports = (req, res, next) => {
  const {article} = res.locals;
  const commentId = req.params.commentId;

  const comment = article.comments.find((item) => (item.id === commentId));

  if (!comment) {
    res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
    return null;
  }

  res.locals.comment = comment;

  next();
};
