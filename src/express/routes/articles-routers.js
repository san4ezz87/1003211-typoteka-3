"use strict";

const { Router } = require(`express`);
const router = new Router();

const { ensureArray, prepareErrors } = require(`../../utils`);

const { upload } = require(`../middlewares`);

const { getAPI } = require(`../api.js`);
const api = getAPI();

const getEditArticleData = async (articleId) => {
  return await Promise.all([
    api.getArticle(articleId, { comments: false }),
    api.getCategories(),
  ]);
};

router.get(`/category/:id`, (req, res) => {
  res.render(`articles-by-category`);
});

router.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();

  res.render(`admin-add-new-post-empty`, { categories });
});

router.post(`/add`, upload.single(`upload`), async (req, res) => {
  const { body, file } = req;

  const article = {
    title: body.title,
    announce: body.announce,
    fullText: body.fullText,
    categories: ensureArray(body.categories || ""),
    img: {
      src: (file && file.filename) || "",
    },
  };

  try {
    await api.createArticle(article);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();

    res.render(`admin-add-new-post-empty`, { categories, validationMessages });
  }
});

router.get(`/edit/:id`, async (req, res) => {
  const { id } = req.params;

  let article, categories;
  try {
    [article, categories] = await getEditArticleData(id);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      res.render(`errors/404`);
      return [];
    }

    res.render(`errors/500`);
  }

  if (article && categories) {
    res.render(`admin-add-new-post`, { id, article, categories });
  }
});

router.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const { body, file } = req;
  const { id } = req.params;

  const article = {
    title: body.title,
    announce: body.announce,
    fullText: body.fullText,
    categories: ensureArray(body.categories || ""),
    img: {
      src: (file && file.filename) || "",
    },
  };

  try {
    await api.createArticle(article);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();

    res.render(`admin-add-new-post`, {
      id,
      article,
      categories,
      validationMessages,
    });
  }
});

router.get(`/:id`, async (req, res) => {
  const { id } = req.params;
  const article = await api.getArticle(id, { comments: true });

  res.render(`article`, { article });
});

router.post(`/:id/comments`, async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  try {
    await api.createComment(id, comment);
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const article = await api.getArticle(id, { comments: true });
    const validationMessages = prepareErrors(errors);
    res.render(`article`, { article, comment, validationMessages });
  }
});

module.exports = router;
