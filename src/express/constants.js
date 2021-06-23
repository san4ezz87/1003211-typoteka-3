'use strict';

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

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};

module.exports = {
  HttpCode,
  Env
};
