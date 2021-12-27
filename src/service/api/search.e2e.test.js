"use strict";
const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const passwordUtils = require(`../lib/password`);

const initDB = require(`../lib/init-db`);
const search = require(`./search`);
const { SearchService } = require(`../data-service/search`);
const { HttpCode } = require(`../constants`);

const usersRow = async () => [
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

const mockCategories = [
  { name: `Деревья` },
  { name: `За жизнь` },
  { name: `Без рамки` },
  { name: `Разное` },
  { name: `IT` },
  { name: `Музыка` },
  { name: `Кино` },
  { name: `Программирование` },
  { name: `Домино` },
  { name: `Гастроном` },
  { name: `Вкусно` },
  { name: `Железо` },
];

const mockArticles = [
  {
    user: "ivanov@example.com",
    title: `Как собрать камни бесконечности`,
    announce: `  Простые ежедневные упражнения помогут достичь успеха.   Первая большая ёлка была установлена только в 1938 году.   За последние 20 лет работа с компьютером стала очень распространённым явлением,   Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    fullText: `  Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.   Один из таких языков, JavaScript, встроен почти в любой веб-браузер,   почти вытеснены графическими. Но они всё ещё есть – если вы знаете, где их искать.   Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.   и потому доступен почти на каждом вычислительном устройстве.   Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?   Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.   Как начать действовать? Для начала просто соберитесь.   Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.   Простые ежедневные упражнения помогут достичь успеха.   Человеческие языки позволяют комбинировать слова великим множеством способов   Он написал больше 30 хитов.`,
    categories: [
      { name: `Деревья` },
      { name: `За жизнь` },
      { name: `Без рамки` },
      { name: `Разное` },
    ],
    comments: [
      {
        text: ``,
        user: "ivanov@example.com",
      },
      {
        text: `Мне кажется или я уже читал это где-то?,Согласен с автором!,Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.,Это где ж такие красоты?,Совсем немного...,Хочу такую же футболку :-),`,
        user: "ivanov@example.com",
      },
      {
        text: `Совсем немного...,Планируете записать видосик на эту тему?Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.,`,
        user: "petrov@example.com",
      },
    ],
  },
  {
    user: "petrov@example.com",
    title: `Как начать программировать`,
    announce: `  Но мы не нашли хороший способ передавать компьютеру при помощи перемещений и нажатий   Ёлки — это не просто красивое дерево. Это прочная древесина.   Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?   Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `  и потому доступен почти на каждом вычислительном устройстве.   Первая большая ёлка была установлена только в 1938 году.   Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?   Эта книга рассказывает, как заставить компьютеры делать то, что вам от них нужно.   Достичь успеха помогут ежедневные повторения.   Из под его пера вышло 8 платиновых альбомов.   почти вытеснены графическими. Но они всё ещё есть – если вы знаете, где их искать.   Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.   Программировать не настолько сложно, как об этом говорят.   Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.   Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.   Золотое сечение — соотношение двух величин, гармоническая пропорция.   Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.   Это один из лучших рок-музыкантов.`,
    categories: [
      { name: `Кино` },
      { name: `Программирование` },
      { name: `Домино` },
      { name: `Гастроном` },
      { name: `Вкусно` },
    ],
    comments: [
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.,Мне кажется или я уже читал это где-то?,Хочу такую же футболку :-),Плюсую, но слишком много буквы!,Согласен с автором!,Совсем немного...,Это где ж такие красоты?,`,
        user: "ivanov@example.com",
      },
      {
        text: `Совсем немного...,Согласен с автором!,Плюсую, но слишком много буквы!,Это где ж такие красоты?,Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.,`,
        user: "ivanov@example.com",
      },
      {
        text: `Мне кажется или я уже читал это где-то?,Планируете записать видосик на эту тему?Это где ж такие красоты?,Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.,`,
        user: "petrov@example.com",
      },
    ],
  },
  {
    user: "ivanov@example.com",
    title: `Как достигнуть успеха не вставая с кресла`,
    announce: `  и интерфейсы, построенные на языке (а когда-то это был единственный способ общения с компьютером)   За последние 20 лет работа с компьютером стала очень распространённым явлением,   Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.   Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `  Вы можете достичь всего. Стоит только немного постараться и запастись книгами.   Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.   Он написал больше 30 хитов.   Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?   Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.   Это один из лучших рок-музыкантов.   Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.   Эта книга рассказывает, как заставить компьютеры делать то, что вам от них нужно.   Простые ежедневные упражнения помогут достичь успеха.   Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.   Первая большая ёлка была установлена только в 1938 году.   Ёлки — это не просто красивое дерево. Это прочная древесина.   почти вытеснены графическими. Но они всё ещё есть – если вы знаете, где их искать.`,
    categories: [
      { name: `Деревья` },
      { name: `За жизнь` },
      { name: `Без рамки` },
      { name: `Разное` },
      { name: `Программирование` },
      { name: `Домино` },
      { name: `Вкусно` },
    ],
    comments: [
      {
        text: `Плюсую, но слишком много буквы!,Это где ж такие красоты?,Согласен с автором!,Планируете записать видосик на эту тему?Мне кажется или я уже читал это где-то?,Совсем немного...,`,
        user: "ivanov@example.com",
      },
      {
        text: `Планируете записать видосик на эту тему?`,
        user: "petrov@example.com",
      },
      {
        text: ``,
        user: "ivanov@example.com",
      },
    ],
  },
  {
    user: "petrov@example.com",
    title: `Обзор новейшего смартфона`,
    announce: `  Из под его пера вышло 8 платиновых альбомов.   Но мы не нашли хороший способ передавать компьютеру при помощи перемещений и нажатий   Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.   Это один из лучших рок-музыкантов.`,
    fullText: `  Ёлки — это не просто красивое дерево. Это прочная древесина.   Эта книга рассказывает, как заставить компьютеры делать то, что вам от них нужно.   Программировать не настолько сложно, как об этом говорят.   Простые ежедневные упражнения помогут достичь успеха.   Первая большая ёлка была установлена только в 1938 году.   Он написал больше 30 хитов.`,
    categories: [
      { name: `Без рамки` },
      { name: `Разное` },
      { name: `IT` },
      { name: `Кино` },
      { name: `Программирование` },
      { name: `Домино` },
    ],
    comments: [
      {
        text: `Это где ж такие красоты?,Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.,`,
        user: "ivanov@example.com",
      },
      {
        text: `Плюсую, но слишком много буквы!,Это где ж такие красоты?,Мне кажется или я уже читал это где-то?,Хочу такую же футболку :-),Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.,Совсем немного...,`,
        user: "petrov@example.com",
      },
      {
        text: ``,
        user: "petrov@example.com",
      },
      {
        text: ``,
        user: "petrov@example.com",
      },
      {
        text: `Мне кажется или я уже читал это где-то?,Согласен с автором!,Хочу такую же футболку :-),Это где ж такие красоты?,Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.,Планируете записать видосик на эту тему?Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.,`,
        user: "ivanov@example.com",
      },
    ],
  },
  {
    user: "ivanov@example.com",
    title: `Как перестать беспокоиться и начать жить`,
    announce: `  Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.   Ёлки — это не просто красивое дерево. Это прочная древесина.   и интерфейсы, построенные на языке (а когда-то это был единственный способ общения с компьютером)   Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `  Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.   Один из таких языков, JavaScript, встроен почти в любой веб-браузер,   и потому доступен почти на каждом вычислительном устройстве.   За последние 20 лет работа с компьютером стала очень распространённым явлением,   Простые ежедневные упражнения помогут достичь успеха.   Человеческие языки позволяют комбинировать слова великим множеством способов   и интерфейсы, построенные на языке (а когда-то это был единственный способ общения с компьютером)   Но мы не нашли хороший способ передавать компьютеру при помощи перемещений и нажатий`,
    categories: [],
    comments: [
      {
        text: ``,
        user: "petrov@example.com",
      },
      {
        text: ``,
        user: "petrov@example.com",
      },
      {
        text: `Плюсую, но слишком много буквы!,Совсем немного...,Мне кажется или я уже читал это где-то?,Это где ж такие красоты?,Планируете записать видосик на эту тему?Хочу такую же футболку :-),Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.,`,
        user: "ivanov@example.com",
      },
      {
        text: ``,
        user: "ivanov@example.com",
      },
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.,Согласен с автором!,Мне кажется или я уже читал это где-то?,`,
        user: "ivanov@example.com",
      },
      {
        text: `Хочу такую же футболку :-),Совсем немного...,Планируете записать видосик на эту тему?Согласен с автором!,Мне кажется или я уже читал это где-то?,Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.,`,
        user: "petrov@example.com",
      },
    ],
  },
];

const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });

const app = express();
app.use(express.json());

beforeAll(async () => {
  const users = await usersRow();

  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    users,
  });

  search(app, new SearchService(mockDB));
});

describe(`API returns articles based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`).query({
      query: `собрать камни`,
    });
  });

  test(`Status code 200`, () => {
    return expect(response.status).toBe(HttpCode.OK);
  });
  test(`1 acticle found`, () => expect(response.body.length).toBe(1));
  test(`article has correct id`, () =>
    expect(response.body[0].title).toBe(`Как собрать камни бесконечности`));
});

test(`API returns 404 if nothing is found`, async () =>
  await request(app)
    .get(`/search`)
    .query({
      query: `Продам твою душу`,
    })
    .expect(HttpCode.NOT_FOUND));

test(`API returns 400 when query string is absent`, async () =>
  await request(app).get(`/search`).expect(HttpCode.BAD_REQUEST));
