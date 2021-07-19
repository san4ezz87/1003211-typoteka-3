'use strict';

const {getRandomNumber} = require(`./getRandomNumber`);

const MONTHS_IN_YEAR = 12;

const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const generateMonth = (now) => {
  const passedMonth = getRandomNumber(0, 3);
  const currentMonth = now.getMonth();

  return passedMonth > currentMonth
    ? MONTHS_IN_YEAR + currentMonth - passedMonth
    : currentMonth - passedMonth;
};

module.exports.formatDate = (date) => {
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

module.exports.generateDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = generateMonth(now);
  const day =
    now.getMonth() === month
      ? getRandomNumber(1, now.getDate())
      : getRandomNumber(1, daysInMonth(year, month));
  const hours = getRandomNumber(1, 23);
  const minutes = getRandomNumber(1, 59);
  const seconds = getRandomNumber(1, 59);
  return new Date(year, month, day, hours, minutes, seconds);
};