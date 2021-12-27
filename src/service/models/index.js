"use strict";

const { DataTypes, Model } = require(`sequelize`);

const Aliase = require(`./aliase`);

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);

  Article.hasMany(Comment, { as: Aliase.COMMENTS, foreingKey: `article_id` });
  Comment.belongsTo(Article, { foreingKey: `article_id` });

  ArticleCategory.init(
    {
      ArticleId: {
        field: `article_id`,
        type: DataTypes.INTEGER,
      },
      CategoryId: {
        field: `category_id`,
        type: DataTypes.INTEGER,
      },
    },
    {
      modelName: `ArticleCategory`,
      tableName: Aliase.ARTICLE_CATEGORIES,
      sequelize,
    }
  );
  Article.belongsToMany(Category, {
    through: ArticleCategory,
    as: Aliase.CATEGORIES,
  });
  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: Aliase.ARTICLES,
  });
  Category.hasMany(ArticleCategory, { as: Aliase.ARTICLE_CATEGORIES });

  User.hasMany(Article, { as: Aliase.ARTICLES, foreignKey: `userId` });
  Article.belongsTo(User, { as: Aliase.USER, foreignKey: `userId` });

  User.hasMany(Comment, { as: Aliase.COMMENTS, foreignKey: `userId` });
  Comment.belongsTo(User, { as: Aliase.USER, foreignKey: `userId` });

  return { Category, Comment, ArticleCategory, Article, User };
};

module.exports = define;
