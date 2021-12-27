"use strict";

const path = require(`path`);

const { shuffle, getStaticFromFile, getRandomNumber } = require(`../../utils`);

const initDb = require(`../lib/init-db`);

const sequelize = require(`../lib/sequelize`);

const { getLogger } = require(`../lib/logger`);

const logger = getLogger({ name: `generator` });

const passwordUtils = require(`../lib/password`);

const TITLLES_URL = `./data/titles.txt`;
const ANNOUNCE_URL = `./data/sentences.txt`;
const CATEGORY_URL = `./data/categories.txt`;
const COMMENTS_URL = `./data/comments.txt`;
const IMG_URL = `./data/img.txt`;

const preparePath = (url) => path.resolve(__dirname, `../../../`, url);

const COUNT_DEFAULT = 1;
const MAX_ELEMENTS = 1000;

const srcsetList = [`@1x.jpg`, `@2x.jpg 2x`];

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomNumber(1, items.length - 1);
  const result = [];
  while (count--) {
    const id = getRandomNumber(1, items.length);
    if (!result.includes(id)) {
      result.push(id);
    }
  }
  return result;
};

const buildSrcset = (picturName) => {
  return srcsetList.map((pictureSize) => {
    return `img/${picturName}${pictureSize}`;
  });
};

const generateArticless = (
  count,
  titles,
  announces,
  category,
  comments,
  images,
  users
) => {
  return Array(count)
    .fill({})
    .map((_, index) => {
      const srcSet = index % 4 ? buildSrcset(shuffle(images).slice(0, 1)) : [];

      return {
        title: titles[getRandomNumber(0, titles.length - 1)],
        announce: shuffle(announces).slice(0, 4).join(` `),
        fullText: shuffle(announces).slice(0, getRandomNumber(4, 23)).join(` `),
        categories: getRandomSubarray(category),
        comments: Array(getRandomNumber(0, 10))
          .fill({})
          .map(() => {
            return {
              text: shuffle(comments)
                .slice(1, getRandomNumber(2, comments.length - 1))
                .join(``),
              user: users[getRandomNumber(0, users.length - 1)].email,
            };
          }),
        picture: srcSet[0],
        user: users[getRandomNumber(0, users.length - 1)].email,
      };
    });
};

module.exports = {
  name: `--filldb`,
  async run([count]) {
    const countChecked = Number.parseInt(count, 10) || COUNT_DEFAULT;

    const users = [
      {
        name: `Иван Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: `avatar01.jpg`,
      },
      {
        name: `Пётр Петров`,
        email: `petrov@example.com`,
        passwordHash: await passwordUtils.hash(`petrov`),
        avatar: `avatar02.jpg`,
      },
    ];

    if (countChecked > MAX_ELEMENTS) {
      logger.error(`Не больше 1000 статей`);
      return;
    }

    try {
      logger.info(`Trying to connect to database ...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }

    logger.info(`Connection to database established`);

    const titles = await getStaticFromFile(preparePath(TITLLES_URL), logger);
    const announces = await getStaticFromFile(
      preparePath(ANNOUNCE_URL),
      logger
    );
    const categoriesText = await getStaticFromFile(
      preparePath(CATEGORY_URL),
      logger
    );
    const comments = await getStaticFromFile(preparePath(COMMENTS_URL), logger);
    const images = await getStaticFromFile(preparePath(IMG_URL), logger);

    const articles = generateArticless(
      countChecked,
      titles,
      announces,
      categoriesText,
      comments,
      images,
      users
    );

    const categories = categoriesText.map((category) => {
      return { name: category };
    });

    await initDb(sequelize, { categories, articles, users });
  },
};
