"use strict";

const { Router } = require(`express`);
const router = new Router();
const multer = require(`multer`);

const { ensureArray, prepareErrors } = require(`../../utils`);

const { storage } = require(`../middlewares`);

const { getAPI } = require(`../api.js`);
const api = getAPI();

router.get(`/category/:id`, (req, res) => {
  res.render(`articles-by-category`);
});

router.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();

  console.log("categories *****", categories);

  res.render(`admin-add-new-post-empty`, { categories });
});

const upload = multer({ storage });

router.post(`/add`, upload.single(`upload`), async (req, res) => {
  const { body, file } = req;
  console.log("body.category", body);
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
  // TODO  научится обрабатывать ошибки что это было правильно
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories(),
  ]).catch((err) => {
    if (err.response.status === 404) {
      res.render(`errors/404`);
      return [];
    }

    res.render(`errors/500`);
    return [];
  });
  if (article && categories) {
    res.render(`admin-add-new-post`, { article, categories });
  }
});

router.get(`/:id`, async (req, res) => {
  const { id } = req.params;
  const article = await api.getArticle(id, { comments: true });

  res.render(`article`, { article });
});

module.exports = router;
