'use strict';

const {storage} = require(`./img-storage`);
const handleServerError = require(`./handle-server-error`);
const handleClientError = require(`./handle-client-error`);

module.exports = {
  storage,
  handleServerError,
  handleClientError
};
