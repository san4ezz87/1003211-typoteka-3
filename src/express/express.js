'use strict';

const path = require(`path`);
const express = require(`express`);
const app = express();

const session = require(`express-session`);
const sequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const {SESSION_SECRET} = process.env;
if(!SESSION_SECRET){
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}


const requestResponseLogger = require(`../common/middlewares/request-response-logger`);


const APPLICATION_PORT = process.env.PORT || 8080;

const PUBLIC_DIR = `/public`;
const UPLOAD_DIR = `/upload`;

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRouters = require(`./routes/articles-routers`);

const {handleServerError} = require(`./middlewares`);
const {handleClientError} = require(`./middlewares`);

const {getLogger} = require(`./logger`);

const logger = getLogger({name: `templates`});

app.set(`view engine`, `pug`);
app.set(`views`, path.resolve(__dirname + `/templates`));

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

app.use(express.urlencoded());
app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false
}))

app.use(express.static(path.resolve(__dirname + PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname + UPLOAD_DIR)));

app.use(requestResponseLogger(logger));


app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRouters);

app.use(handleClientError(logger));
app.use(handleServerError(logger));


app.listen(APPLICATION_PORT, () => {
  console.log(`Example app listening at http://localhost:${APPLICATION_PORT}`);
});
