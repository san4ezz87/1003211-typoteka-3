"use strict";

const upload = require(`./img-storage`);
const handleServerError = require(`./handle-server-error`);
const handleClientError = require(`./handle-client-error`);

module.exports = {
  upload,
  handleServerError,
  handleClientError,
};
