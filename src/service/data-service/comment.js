'use strict'

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  async create(offerId, comment) {
    return this._Comment.create({
      offerId,
      ...comment
    });
  }

  async drop(id) {
    const deleteRows = this._Comment.destroy({
      where: {id}
    })
    return !!deleteRows;
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {ArticleId: articleId},
      raw: true
    })
  }
}

module.exports = {
  CommentService
}