"use strict";

const { Op } = require(`sequelize`);
const Aliase = require(`../models/aliase`);
class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._User = sequelize.models.User;
  }

  async search(text) {
    const article = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: text,
        },
      },
      include: [
        Aliase.CATEGORIES,
        {
          model: this._User,
          as: Aliase.USER,
          attributes: {
            exlude: [`passwordHash`],
          },
        },
      ],
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
