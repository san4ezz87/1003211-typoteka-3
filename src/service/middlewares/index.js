'use strict';

const articleValidator = require(`./articles-validator`);
const articleExist = require(`./article-exist`);
const articleCommentExist = require(`./article-comment-exist`);
const articleCommentValidator = require(`./article-comment-validator`);

const handleServerError = require(`./handle-server-error`);
const handleClientError = require(`./handle-client-error`);

module.exports = {
  articleValidator,
  articleExist,
  articleCommentExist,
  articleCommentValidator,
  handleServerError,
  handleClientError
};
