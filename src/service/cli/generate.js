"use strict";

const fs = require(`fs`).promises;
const path = require(`path`);
const chalk = require(`chalk`);
const {getRandomNumber, shuffle} = require(`../../utils`);

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../constants`);

const TITLLES_URL = `./data/titles.txt`;
const ANNOUNCE_URL = `./data/sentences.txt`;
const CATEGORY_URL = `./data/categories.txt`;
const COMMENTS_URL = `./data/comments.txt`;

const preparePath = (url) => path.resolve(__dirname, `../../../`, url);
const getStaticFromFile = async (url) => {
  try {
    const data = await fs.readFile(url, `utf8`);
    return data.split(`\n`);
  } catch (e) {
    console.log(chalk.red(`Не удалось прочитать файл`));
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

const generateOffers = (count, titles, announces, cantegory, comments) => {
  return Array(count)
    .fill({})
    .map(() => {
      const date = generateDate();
      const dateFormated = formatDate(date);
      const id = nanoid(MAX_ID_LENGTH);

      return {
        id,
        title: titles[getRandomNumber(0, titles.length - 1)],
        createdDate: dateFormated,
        announce: shuffle(announces).slice(0, 4).join(` `),
        fullText: shuffle(announces).slice(0, getRandomNumber(4, 23)).join(` `),
        category: shuffle(cantegory).slice(
            0,
            getRandomNumber(0, cantegory.length - 1)
        ),
        comments: Array(getRandomNumber(0, 10)).fill({}).map(() => {
          return {
            id: nanoid(MAX_ID_LENGTH),
            text: shuffle(comments).slice(1, getRandomNumber(0, comments.length - 1)).join(``)
          };
        })
      };
    });
};

const writeFile = async (content) => {
  try {
    await fs.writeFile(`mocks.json`, content);
  } catch (e) {
    console.log(chalk.red(`Не удалось записать файл!`));
    return process.exit(1);
  }
  console.log(chalk.green(`Файл успешно записан!`));
  return process.exit(0);
};

module.exports = {
  name: `--generate`,
  async run([count]) {
    const countChecked = Number.parseInt(count, 10) || COUNT_DEFAULT;

    if (countChecked > MAX_ELEMENTS) {
      console.log(`Не больше 1000 объявлений`);
      return;
    }

    const titles = await getStaticFromFile(preparePath(TITLLES_URL));
    const announces = await getStaticFromFile(preparePath(ANNOUNCE_URL));
    const cantegory = await getStaticFromFile(preparePath(CATEGORY_URL));
    const comments = await getStaticFromFile(preparePath(COMMENTS_URL));

    const content = JSON.stringify(generateOffers(countChecked, titles, announces, cantegory, comments), null, 2);
    writeFile(content);
  },
};
