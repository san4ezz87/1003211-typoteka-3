const { hash, hashSync, compare } = require(`bcrypt`);

const SALT_ROUNDS = 10;

module.exports = {
  hash: (password) => hash(password, SALT_ROUNDS),
  hashSync: (password) => hash(password, SALT_ROUNDS),
  compare
};
