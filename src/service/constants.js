'use strict';

const API_PREFIX = `/api`;

const HttpCode = {
  OK: 200,
  CREATED: 201,
  DELETED: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

const DEFAULT_PORT = 3000;
const MAX_ID_LENGTH = 6;

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};

module.exports = {
  API_PREFIX,
  DEFAULT_PORT,
  MAX_ID_LENGTH,
  HttpCode,
  Env,
};

