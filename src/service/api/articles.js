'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const {
  articleValidator,
  articleExist,
  articleCommentExist,
  articleCommentValidator
} = require(`../middlewares`);


module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {comments} = req.query;
    const articles = await articleService.findAll(comments);
    res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);
    res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, articleExist(articleService), articleValidator, async (req, res) => {
    const id = req.params.articleId;
    const article = await articleService.update(id, req.body);

    res.status(HttpCode.OK).json(article);
  });

  route.delete(`/:articleId`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;
    const articleDeleted = await articleService.drop(article.id);
    res.status(HttpCode.OK).send(articleDeleted);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;
    const comments = await commentService.findAll(article.id)
    res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, [articleExist(articleService), articleCommentExist], (req, res) => {
    const {article, comment} = res.locals;

    articleService.dropComment(article, comment);

    res.status(HttpCode.OK).send(comment);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), articleCommentValidator], (req, res) => {
    const {article} = res.locals;

    const comment = articleService.createComment(article, req.body);

    res.status(HttpCode.CREATED).json(comment);
  });
};
