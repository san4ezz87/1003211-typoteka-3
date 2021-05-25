'use strict';

class CategoriesService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, article) => {
      article.category.forEach((category) => acc.add(category));
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = {
  CategoriesService
};
