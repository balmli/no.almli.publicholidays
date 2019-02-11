const expect = require("chai").expect;
const holidays = require('../lib/holidays');

/*
let addDate = function (date, days) {
    var ret = new Date(date);
    ret.setDate(ret.getDate() + days);
    return ret;
};

console.log('Norway');
let curDate = new Date(2019, 0, 1);
for (let i = 0; i < 365; i++) {
    let hd = holidays.isHoliday('NO', curDate);
    if (hd !== false) {
        console.log(hd.date, hd.type);
    }
    curDate = addDate(curDate, 1);
}

console.log('Sweden');
curDate = new Date(2019, 0, 1);
for (let i = 0; i < 365; i++) {
    let hd = holidays.isHoliday('SE', curDate);
    if (hd !== false) {
        console.log(hd.date, hd.type);
    }
    curDate = addDate(curDate, 1);
}

console.log('Netherlands');
curDate = new Date(2019, 0, 1);
for (let i = 0; i < 365; i++) {
    let hd = holidays.isHoliday('NL', curDate);
    if (hd !== false) {
        console.log(hd.date, hd.type);
    }
    curDate = addDate(curDate, 1);
}

*/