"use strict";

const fs = require(`fs`).promises;
const path = require(`path`);
const {getRandomNumber, shuffle} = require(`../../utils`);

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../constants`);

const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `generator`});

const TITLLES_URL = `./data/titles.txt`;
const ANNOUNCE_URL = `./data/sentences.txt`;
const CATEGORY_URL = `./data/categories.txt`;
const COMMENTS_URL = `./data/comments.txt`;
const IMG_URL = `./data/img.txt`;

const preparePath = (url) => path.resolve(__dirname, `../../../`, url);
const getStaticFromFile = async (url) => {
  try {
    const data = await fs.readFile(url, `utf8`);
    return data.split(`\n`);
  } catch (e) {
    logger.error(`Не удалось прочитать файл ${url}`);
    return [];
  }
};

const COUNT_DEFAULT = 1;
const MAX_ELEMENTS = 1000;
const MONTHS_IN_YEAR = 12;

const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const generateMonth = (now) => {
  const passedMonth = getRandomNumber(0, 3);
  const currentMonth = now.getMonth();

  return passedMonth > currentMonth
    ? MONTHS_IN_YEAR + currentMonth - passedMonth
    : currentMonth - passedMonth;
};

const generateDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = generateMonth(now);
  const day =
    now.getMonth() === month
      ? getRandomNumber(1, now.getDate())
      : getRandomNumber(1, daysInMonth(year, month));
  const hours = getRandomNumber(1, 23);
  const minutes = getRandomNumber(1, 59);
  const seconds = getRandomNumber(1, 59);
  return new Date(year, month, day, hours, minutes, seconds);
};

const formatDate = (date) => {
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const srcsetList = [`@1x.jpg`, `@2x.jpg 2x`];

const buildSrcset = (picturName) => {
  return srcsetList.map((pictureSize) => {
    return `img/${picturName}${pictureSize}`;
  });
};

const generateOffers = (count, titles, announces, cantegory, comments, images) => {
  return Array(count)
    .fill({})
    .map((_, index) => {
      const date = generateDate();
      const dateFormated = formatDate(date);
      const id = nanoid(MAX_ID_LENGTH);

      const srcSet = index % 4 ? buildSrcset(shuffle(images).slice(0, 1)) : [];

      return {
        id,
        title: titles[getRandomNumber(0, titles.length - 1)],
        createdDate: dateFormated,
        announce: shuffle(announces).slice(0, 4).join(` `),
        fullText: shuffle(announces).slice(0, getRandomNumber(4, 23)).join(` `),
        category: shuffle(cantegory).slice(
            0,
            getRandomNumber(1, 4)
        ),
        comments: Array(getRandomNumber(0, 10)).fill({}).map(() => {
          return {
            id: nanoid(MAX_ID_LENGTH),
            text: shuffle(comments).slice(1, getRandomNumber(2, comments.length - 1)).join(``)
          };
        }),
        img: {
          srcSet: srcSet.join(`, `),
          src: srcSet[0] || ``,
          alt: srcSet[0]
        }
      };
    });
};

const writeFile = async (content) => {
  try {
    await fs.writeFile(`mocks.json`, content);
  } catch (e) {
    logger.error(`Не удалось записать файл mocks.json!`);
    return process.exit(1);
  }

  logger.info(`Файл mocks.json успешно записан!`);
  return process.exit(0);
};

module.exports = {
  name: `--generate`,
  async run([count]) {
    const countChecked = Number.parseInt(count, 10) || COUNT_DEFAULT;

    if (countChecked > MAX_ELEMENTS) {
      logger.error(`Не больше 1000 объявлений`);
      return;
    }

    const titles = await getStaticFromFile(preparePath(TITLLES_URL));
    const announces = await getStaticFromFile(preparePath(ANNOUNCE_URL));
    const cantegory = await getStaticFromFile(preparePath(CATEGORY_URL));
    const comments = await getStaticFromFile(preparePath(COMMENTS_URL));
    const images = await getStaticFromFile(preparePath(IMG_URL));

    const content = JSON.stringify(generateOffers(countChecked, titles, announces, cantegory, comments, images), null, 2);
    writeFile(content);
  },
};
