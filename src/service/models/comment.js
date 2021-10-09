'use strict'

const {DataTypes, Model} = require(`sequelize`);

class Comment extends Model {}

const define = (sequelize) => Comment.init({
  text: {
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  ArticleId: {
    field: `article_id`,
    type: DataTypes.INTEGER
  }
},{
  sequelize,
  modelName: `Comment`,
  tableName: `comments`
})

module.exports = define;