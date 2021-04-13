'use strict';

const fs = require(`fs`);
const chalk = require(`chalk`);
const {getRandomNumber, shuffle} = require(`../../utils`);

const TITLLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];

const ANNOUNCE = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];

const CATEGORY = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];


const COUNT_DEFAULT = 1;
const MAX_ELEMENTS = 1000;
const MONTHS_IN_YEAR = 12;

const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const generateMonth = (now) => {
  const passedMonth = getRandomNumber(0, 3);
  const currentMonth = now.getMonth();

  return passedMonth > currentMonth ? (MONTHS_IN_YEAR + currentMonth) - passedMonth : currentMonth - passedMonth;
};

const generateDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = generateMonth(now);
  const day = now.getMonth() === month ? (getRandomNumber(1, now.getDate())) : getRandomNumber(1, daysInMonth(year, month));
  const hours = getRandomNumber(1, 23);
  const minutes = getRandomNumber(1, 59);
  const seconds = getRandomNumber(1, 59);
  return new Date(year, month, day, hours, minutes, seconds);
};

const formatDate = (date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};


const generateOffers = (count) => {
  return Array(count).fill({}).map(() => {
    const date = generateDate();
    const dateFormated = formatDate(date);

    return {
      title: TITLLES[getRandomNumber(0, TITLLES.length - 1)],
      createdDate: dateFormated,
      announce: shuffle(ANNOUNCE).slice(0, 4).join(` `),
      fullText: shuffle(ANNOUNCE).slice(0, getRandomNumber(4, 23)).join(` `),
      catefory: shuffle(CATEGORY).slice(0, getRandomNumber(0, CATEGORY.length - 1))
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
  run([count]) {
    const countChecked = Number.parseInt(count, 10) || COUNT_DEFAULT;

    if (countChecked > MAX_ELEMENTS) {
      console.log(`Не больше 1000 объявлений`);
      return;
    }

    const content = JSON.stringify(generateOffers(countChecked), null, 2);
    writeFile(content);

  }
};
