module.exports.ensureArray = (value) => {
  return Array.isArray(value) ? value : [value];
};
