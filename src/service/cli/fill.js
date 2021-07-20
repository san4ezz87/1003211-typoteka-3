"use strict";

const path = require(`path`);
const {
  getRandomNumber,
  shuffle,
  getStaticFromFile,
  writeFile,
} = require(`../../utils`);

const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `fill`});

const TITLLES_URL = `./data/titles.txt`;
const ANNOUNCE_URL = `./data/sentences.txt`;
const CATEGORY_URL = `./data/categories.txt`;
const COMMENTS_URL = `./data/comments.txt`;
const IMG_URL = `./data/img.txt`;

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const preparePath = (url) => path.resolve(__dirname, `../../../`, url);

const COUNT_DEFAULT = 1;
const MAX_ELEMENTS = 1000;


const generateArticless = (count, titles, announces, cantegory, comments, images) => {
  return Array(count)
    .fill({})
    .map((_, index) => {

      const img = index % 4 ? `${shuffle(images).slice(0, 1)}@1x.jpg` : ``;

      return {
        title: titles[getRandomNumber(0, titles.length - 1)],
        announce: shuffle(announces).slice(0, 4).join(` `),
        fullText: shuffle(announces).slice(0, getRandomNumber(4, 23)).join(` `),
        category: shuffle(cantegory).slice(
            0,
            getRandomNumber(1, 4)
        ),
        comments: Array(getRandomNumber(0, 10)).fill({}).map(() => {
          return {
            text: shuffle(comments).slice(1, getRandomNumber(2, comments.length - 1)).join(``)
          };
        }),
        img
      };
    });
};


module.exports = {
  name: `--fill`,
  async run([count]) {
    const countChecked = Number.parseInt(count, 10) || COUNT_DEFAULT;

    if (countChecked > MAX_ELEMENTS) {
      logger.error(`Не больше 1000 объявлений`);
      return;
    }

    const titles = await getStaticFromFile(preparePath(TITLLES_URL), logger);
    const announces = await getStaticFromFile(preparePath(ANNOUNCE_URL), logger);
    const categories = await getStaticFromFile(preparePath(CATEGORY_URL), logger);
    const comments = await getStaticFromFile(preparePath(COMMENTS_URL), logger);
    const images = await getStaticFromFile(preparePath(IMG_URL), logger);

    const articles = generateArticless(countChecked, titles, announces, categories, comments, images);

    const commentsList = articles.flatMap((article, index) => {
      return article.comments.map((comment) => {
        return {
          ...comment,
          articleId: index + 1,
          userId: getRandomNumber(1, users.length)
        };
      });
    });

    const articleCategory = articles.flatMap((article, index) => {
      return article.category.map((categoryInList) => {
        const categoryIndex = categories.indexOf(categoryInList);
        return {
          articleId: index + 1,
          categoryId: categoryIndex + 1,
        };
      });
    });


    const userValues = users.map(({email, passwordHash, firstName, lastName, avatar}) => {
      return `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}' )`;
    }).join(`,\n`);

    const categoryValues = categories.map((name) => {
      return `('${name}')`;
    }).join(`,\n`);

    const articlesValues = articles.map(({title, announce, fullText, img}) => {
      return `('${title}', '${announce}', '${fullText}', '${img}', '${getRandomNumber(1, users.length)}')`;
    }).join(`,\n`);

    const articleCategoryValue = articleCategory.map(({articleId, categoryId}) => {
      return `('${articleId}', '${categoryId}')`;
    }).join(`,\n`);

    const commentsValue = commentsList.map(({text, userId, articleId}) => {
      return `('${text}', '${userId}', '${articleId}')`;
    }).join(`,\n`);

    const contentS = `
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};
INSERT INTO categories(name) VALUES
${categoryValues};
INSERT INTO articles(title, announce, full_text, picture, user_id) VALUES
${articlesValues};
INSERT INTO article_categories(article_id, category_id) VALUES
${articleCategoryValue};
INSERT INTO comments(text, user_id, article_id) VALUES
${commentsValue};
`;

    writeFile(`pgsql/fill-db.pgsql`, contentS, logger);
  },
};
