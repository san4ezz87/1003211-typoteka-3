"use strict";

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, { categories, articles }) => {
  const { Category, Article } = defineModels(sequelize);
  await sequelize.sync({ force: true });

  const categoryModels = await Category.bulkCreate(categories);

  const categoryIdByName = categoryModels.reduce(
    (acc, next) => ({
      [next.name]: next.id,
      ...acc,
    }),
    {}
  );

  const articlesPromises = articles.map(async (article) => {
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
