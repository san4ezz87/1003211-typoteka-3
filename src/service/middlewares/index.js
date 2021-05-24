'use strict';

const articleValidator = require(`./articles-validator`);
const articleExist = require(`./article-exist`);
const articleCommentExist = require(`./article-comment-exist`);
const articleCommentValidator = require(`./article-comment-validator`);

module.exports = {
  articleValidator,
  articleExist,
  articleCommentExist,
  articleCommentValidator,
};
