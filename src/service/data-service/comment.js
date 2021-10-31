"use strict";

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  async create(articleId, comment) {
    const commentRes = await this._Comment.create({
      ArticleId: articleId,
      ...comment,
    });

    return commentRes.get();
  }

  async drop(id) {
    const deleteRows = await this._Comment.destroy({
      where: { id },
    });
    return !!deleteRows;
  }

  async findAll(articleId) {
    const comments = await this._Comment.findAll({
      where: { ArticleId: articleId },
      raw: true,
    });

    return comments;
  }
}

module.exports = {
  CommentService,
};
