"use strict";

const { DataTypes, Model } = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) =>
  Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      announce: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      fullText: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      picture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: `Article`,
      tableName: `articles`,
    }
  );

module.exports = define;
