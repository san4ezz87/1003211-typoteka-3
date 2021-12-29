"use strict";

const { ArticlesService } = require(`./articles`);
const { CategoriesService } = require(`./categories`);
const { SearchService } = require(`./search`);
const { CommentService } = require(`./comment`);
const { UserService } = require(`./user`);

module.exports = {
  ArticlesService,
  CategoriesService,
  SearchService,
  CommentService,
  UserService,
};
