'use strict';

const Holidays = require('date-holidays');
const countries = require('../lib/countries');

console.log(`'use strict';`);
console.log('const holidays_list = {');
countries.map(c => {
    let args = c.id.split('-');
    let hd;
    if (args.length === 2) {
        hd = new Holidays(args[0], args[1].toLowerCase());
    } else if (args.length === 3) {
        hd = new Holidays(args[0], args[1].toLowerCase(), args[2].toLowerCase());
    } else {
        hd = new Holidays(c.id);
    }
    const startYear = new Date().getFullYear();
    for (let year = startYear; year < startYear + 3; year++) {
        let dates = hd.getHolidays(year);
        if (dates) {
            const result = dates
                .filter(date => date.type !== 'public')
                .reduce(
                    (accumulator, target) => ({...accumulator, [target.date.substr(0, 10)]: target}),
                    {});

            const publicHolidays = dates
                .filter(date => date.type === 'public')
                .reduce(
                    (accumulator, target) => ({...accumulator, [target.date.substr(0, 10)]: target}),
                    {});

            Object.keys(publicHolidays).forEach(function (key) {
                result[key] = publicHolidays[key];
            });

            Object.keys(result)
                .sort()
                .forEach(function (key) {
                    let ho = result[key];
                    console.log(`"${c.id}-${ho.date.substr(0, 10)}":{"type":"${ho.type}","name":"${ho.name}"},`);
                });
        }
    }
});
console.log('};');
console.log(`module.exports = holidays_list;`);
