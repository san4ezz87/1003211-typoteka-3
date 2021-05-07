'use strict';

const express = require(`express`);
const app = express();


const fs = require(`fs`).promises;
const path = require(`path`);
const {HttpCode} = require(`../../utils/httpCodes`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

const preparePath = (url) => path.resolve(__dirname, `../../../`, url);

app.use(express.json());

app.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(preparePath(FILENAME));
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.json([]);
  }
});

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).end(`404`);
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).end(`500`);
  }
  next();
});

module.exports = {
  name: `--server`,
  run([customPort]) {
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    });
  }
};
