"use strict";

const Aliase = require(`../models/aliase`);
const { Op } = require("sequelize");

class ArticlesService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findPage({ limit, offset, comments }) {
    const include = [Aliase.CATEGORIES];
    if (comments) {
      include.push(Aliase.COMMENTS);
    }

    const { count, rows } = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [[`createdAt`, `DESC`]],
      distinct: true,
    });

    return { count, articles: rows };
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const articles = await this._Article.findAll({
      include,
      order: [[`createdAt`, `DESC`]],
    });
    return articles.map((item) => item.get());
  }

  async findOne(id, needComments) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const article = await this._Article.findByPk(id, { include });

    return article && article.get();
  }

  async create(articleData) {
    const categories = await this._Category.findAll({
      where: {
        name: {
          [Op.or]: articleData.categories.map((item) => item.name),
        },
      },
    });

    const article = await this._Article.create(articleData);
    await article.addCategories(categories);

    const updatedArticle = await this._Article.findOne({
      where: {
        id: article.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "picture", "id"],
      },
      include: [
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          attributes: ["name"],
          through: {
            attributes: [], // this helps removing the join table in returned data
          },
        },
      ],
    });
    return updatedArticle.get();
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: { id },
    });

    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: { id },
    });
    return !!deletedRows;
  }
}

module.exports = {
  ArticlesService,
};
