'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  search(text) {
    const article = this._articles.filter((item) => {
      return item.title.toLowerCase().includes(text.toLowerCase());
    });

    if (!article.length) {
      return null;
    }

    return article;
  }
}

module.exports = {
  SearchService,
};
