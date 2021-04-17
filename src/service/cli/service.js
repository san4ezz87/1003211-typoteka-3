'use strict';
const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;
const path = require(`path`);
const {HttpCode} = require(`../../utils/httpCodes`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;
const notFoundMessageText = `Not found`;

const sendResponse = (res, statusCode, message) => {
  const template = `
  <!Doctype html>
    <html lan="ru">
    <head>
      <title>With love from Node</title>
    </head>
    <body>${message}</body>
  </html>`.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const preparePath = (url) => path.resolve(__dirname, `../../../`, url);

const onClientConnect = async (req, res) => {
  switch (req.url) {
    case `/`: {
      try {
        const fileContent = await fs.readFile(preparePath(FILENAME));
        const mocks = JSON.parse(fileContent);

        const li = mocks.map((elem) => {
          return `<li>${elem.title}</li>`;
        }).join(``);

        const list = `<ul>${li}</ul>`;
        sendResponse(res, HttpCode.OK, list);
      } catch (e) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }
      break;
    }
    default: {
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
    }
  }
};

module.exports = {
  name: `--server`,
  run([customPort]) {
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    http.createServer(onClientConnect).listen(port).on(`listening`, (err) => {
      if (err) {
        console.log(`Ошибка при создании сервера`, err);
      }

      console.info(console.log(chalk.green(`Ожидаю соединения на порту ${port}`)));
    });
  }
};
