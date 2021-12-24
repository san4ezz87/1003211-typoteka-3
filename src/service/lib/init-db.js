"use strict";

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, { categories, articles, users }) => {
  const { Category, Article, User } = defineModels(sequelize);
  await sequelize.sync({ force: true });

  const userModels = await User.bulkCreate(users, {
    include: [Aliase.ARTICLES, Aliase.COMMENTS],
  });

  const userIdByEmail = userModels.reduce((acc, next) => {
    return {
      [next.email]: next.id,
      ...acc,
    };
  }, {});

  const categoryModels = await Category.bulkCreate(categories);

  const categoryIdByName = categoryModels.reduce(
    (acc, next) => ({
      [next.name]: next.id,
      ...acc,
    }),
    {}
  );

  const articlesPromises = articles.map(async (article) => {
    article.userId = userIdByEmail[article.user];

    article.comments.forEach((comment) => {
      comment.userId = userIdByEmail[comment.user];
    });

    const articleModel = await Article.create(article, {
      include: [Aliase.COMMENTS],
    });

    await articleModel.addCategories(
      article.categories.map((category) => {
        return categoryIdByName[category.name];
      })
    );
  });
  await Promise.all(articlesPromises);
};
