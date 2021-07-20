"use strict";

const path = require(`path`);
const {
  getRandomNumber,
  shuffle,
  generateDate,
  formatDate,
  getStaticFromFile,
  writeFile,
} = require(`../../utils`);

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

const COUNT_DEFAULT = 1;
const MAX_ELEMENTS = 1000;

const srcsetList = [`@1x.jpg`, `@2x.jpg 2x`];

const buildSrcset = (picturName) => {
  return srcsetList.map((pictureSize) => {
    return `img/${picturName}${pictureSize}`;
  });
};

const generateArticless = (count, titles, announces, cantegory, comments, images) => {
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


module.exports = {
  name: `--generate`,
  async run([count]) {
    const countChecked = Number.parseInt(count, 10) || COUNT_DEFAULT;

    if (countChecked > MAX_ELEMENTS) {
      logger.error(`Не больше 1000 объявлений`);
      return;
    }

    const titles = await getStaticFromFile(preparePath(TITLLES_URL), logger);
    const announces = await getStaticFromFile(preparePath(ANNOUNCE_URL), logger);
    const cantegory = await getStaticFromFile(preparePath(CATEGORY_URL), logger);
    const comments = await getStaticFromFile(preparePath(COMMENTS_URL), logger);
    const images = await getStaticFromFile(preparePath(IMG_URL), logger);

    const content = JSON.stringify(generateArticless(countChecked, titles, announces, cantegory, comments, images), null, 2);
    writeFile(`mocks.json`, content, logger);
  },
};
