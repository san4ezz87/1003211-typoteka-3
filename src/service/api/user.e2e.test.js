const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const { UserService } = require(`../data-service/user`);
const { HttpCode } = require(`../constants`);

const passwordUtils = require(`../lib/password`);
const initDB = require(`../lib/init-db`);
const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });

const user = require(`./user`);

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
];

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

const createAPI = async () => {
  const users = await usersRow();

  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    users,
  });

  const app = express();
  app.use(express.json());

  user(app, new UserService(mockDB));
  return app;
};

describe(`API creates user if data is valid`, () => {
  const validUserData = {
    name: `Сидор Сидоров`,
    email: `sidorov@example.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`,
    avatar: `sidorov.jpg`,
  };

  let response;

  beforeAll(async () => {
    let app = await createAPI();
    response = await request(app).post(`/user`).send(validUserData);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));
});

describe(`API refuses to create user if data is invalid`, () => {
  const validUserData = {
    name: `Сидор Сидоров`,
    email: `sidorov@example.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`,
    avatar: `sidorov.jpg`,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(validUserData)) {
      const badUserData = { ...validUserData };
      delete badUserData[key];
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badUsers = [
      { ...validUserData, firstName: true },
      { ...validUserData, email: 1 },
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badUsers = [
      { ...validUserData, password: `short`, passwordRepeated: `short` },
      { ...validUserData, email: `invalid` },
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When password and passwordRepeated are not equal, code is 400`, async () => {
    const badUserData = { ...validUserData, passwordRepeated: `not sidorov` };
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When email is already in use status code is 400`, async () => {
    const badUserData = { ...validUserData, email: `ivanov@example.com` };
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });
});
