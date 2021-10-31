'use strict';

const holidays_list = require('./holidays_list');

const addDate = function (date, days) {
  let ret = new Date(date);
  ret.setDate(ret.getDate() + days);
  return ret;
};

const calcDate = function (aDate, condition) {
  if (condition === 'yesterday') {
    return addDate(aDate, -1);
  } else if (condition === 'tomorrow') {
    return addDate(aDate, 1);
  }
  return aDate;
};

const toJSONLocal = function (date) {
  var local = new Date(date);
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
};

const isHoliday = function (country, aDate, condition) {
  let holi = holidays_list[country + '-' + toJSONLocal(calcDate(aDate, condition))];
  return !holi ? false : holi;
};

module.exports = {
  calcDate,
  isHoliday
};
