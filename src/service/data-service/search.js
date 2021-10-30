"use strict";

const { Op } = require(`sequelize`);
const Aliase = require(`../models/aliase`);
class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  async search(text) {
    const article = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: text,
        },
      },
      include: [Aliase.CATEGORIES],
      order: [[`createdAt`, `DESC`]],
    });

    if (!article.length) {
      return null;
    }

    return article.map((article) => article.get());
  }
}

module.exports = {
  SearchService,
};
