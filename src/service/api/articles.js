'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const {
  articleValidator,
  articleExist,
  articleCommentExist,
  articleCommentValidator
} = require(`../middlewares`);

const route = new Router();


module.exports = (app, articleService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);
    res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, articleValidator, (req, res) => {
    const id = req.params.articleId;
    const article = articleService.update(id, req.body);

    res.status(HttpCode.OK).json(article);
  });

  route.delete(`/:articleId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    articleService.drop(article);
    res.status(HttpCode.DELETED).send(``);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;

    res.status(HttpCode.OK).json(article.comments);
  });

  route.delete(`/:articleId/comments/:commentId`, [articleExist(articleService), articleCommentExist], (req, res) => {
    const {article, comment} = res.locals;

    articleService.dropComment(article, comment);

    res.status(HttpCode.DELETED).send(``);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), articleCommentValidator], (req, res) => {
    const {article} = res.locals;

    const comment = articleService.createComment(article, req.body);

    res.status(HttpCode.CREATED).json(comment);
  });
};
