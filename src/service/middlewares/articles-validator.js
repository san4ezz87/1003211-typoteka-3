"use strict";

const { HttpCode } = require(`../constants`);

const articleKeys = [`title`, `announce`, `full_text`, `categories`];

const Joi = require(`joi`);

const ErrorOfferMessage = {
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  TITLE_MIN: `Заголовок содержит меньше 10 символов`,
  TITLE_MAX: `Заголовок не может содержать более 100 символов`,
  ANNOUNCE_MIN: `Описание содержит меньше 50 символов`,
  ANNOUNCE_MAX: `Описание не может содержать более 200 символов`,
  ANNOUNCE_EMPTY: `Описание не может быть пустым`,
  FULL_TEXT_EMPTY: `Текст не может быть пустым`,
  FULL_TEXT_MIN: `Текст содержит меньше 50 символов`,
  FULL_TEXT_MAX: `Тексе не может содержать более 1000 символов`,
};

const schema = Joi.object({
  categories: Joi.array().required().items(Joi.string().required()).messages({
    "string.empty": ErrorOfferMessage.CATEGORIES,
  }),
  title: Joi.string().min(10).max(100).required().messages({
    "string.min": ErrorOfferMessage.TITLE_MIN,
    "string.max": ErrorOfferMessage.TITLE_MAX,
  }),
  announce: Joi.string().min(50).max(200).required().messages({
    "string.min": ErrorOfferMessage.ANNOUNCE_MIN,
    "string.max": ErrorOfferMessage.ANNOUNCE_MAX,
    "string.empty": ErrorOfferMessage.ANNOUNCE_EMPTY,
  }),
  fullText: Joi.string().min(50).max(1000).required().messages({
    "string.min": ErrorOfferMessage.FULL_TEXT_MIN,
    "string.max": ErrorOfferMessage.FULL_TEXT_MAX,
    "string.empty": ErrorOfferMessage.FULL_TEXT_EMPTY,
  }),
  img: Joi.any(),
});

module.exports = (req, res, next) => {
  const newArticle = req.body;

  const { error } = schema.validate(newArticle, { abortEarly: false });

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
