'use strict';

const {Router} = require(`express`);
const router = new Router();
const multer = require(`multer`);

const {storage} = require(`../middlewares/img-storage`);

const {getAPI} = require(`../api.js`);
const api = getAPI();

router.get(`/category/:id`, (req, res) => {
  res.render(`articles-by-category`);
});

router.get(`/add`, (req, res) => {
  res.render(`admin-add-new-post-empty`);
});

const upload = multer({storage});

router.post(`/add`,
  upload.single(`upload`),
  async (req, res) => {

  const {body, file} = req;
  const article = {
    title: body.title,
    announce: body.announce,
    fullText: body.fullText,
    category: Array.isArray(body.category) ? body.category : [body.category],
    img: {
      src: file.filename
    }
  };
  try {
    await api.createArticle(article);
    res.redirect(`/my`);
  } catch (err) {
    res.render(`admin-add-new-post`, {article, categories: []});
  }
});

router.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  // TODO  научится обрабатывать ошибки что это было правильно
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]).catch((err) => {
    if (err.response.status === 404) {
      res.render(`errors/404`);
      return [];
    }
    res.render(`errors/500`);
    return [];
  });
  if (article && categories) {
    res.render(`admin-add-new-post`, {article, categories});
  }
});

router.get(`/:id`, (req, res) => {
  res.render(`post`);
});

module.exports = router;
