'use strict';

const Holidays = require('date-holidays');
const countries = require('../lib/countries');

function toJSONLocal (date) {
    var local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
}

console.log(`'use strict';`);
console.log('const holidays_list = {');
countries.map(c => {
    let hd = new Holidays(c.id);
    for (let i = 0; i < 3 * 365; i++) {
        var date = new Date(2019, 0, 1);
        date.setDate(date.getDate() + i);
        let ho = hd.isHoliday(date);
        if (ho) {
            let type = ho.type === 'public' ? 'p' : ho.type === 'bank' ? 'b' : ho.type === 'observance' ? 'o' : ho.type;
            console.log(`"${c.id}-${toJSONLocal(date)}": "${type}",`);
        }
    }
});
console.log('};');
console.log(`module.exports = holidays_list;`);
