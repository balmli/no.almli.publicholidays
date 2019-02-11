const expect = require("chai").expect;
const holidays = require('../lib/holidays');

let addDate = function (date, days) {
    var ret = new Date(date);
    ret.setDate(ret.getDate() + days);
    return ret;
};

/*
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

let countries = [
    {
        "id": "AU",
        "label": {
            "en": "Australia"
        }
    },
    {
        "id": "AT",
        "label": {
            "en": "Austria"
        }
    },
    {
        "id": "BE",
        "label": {
            "en": "Belgium"
        }
    },
    {
        "id": "DK",
        "label": {
            "en": "Denmark"
        }
    },
    {
        "id": "EE",
        "label": {
            "en": "Estonia"
        }
    },
    {
        "id": "FI",
        "label": {
            "en": "Finland"
        }
    },
    {
        "id": "FR",
        "label": {
            "en": "France"
        }
    },
    {
        "id": "DE",
        "label": {
            "en": "Germany"
        }
    },
    {
        "id": "IS",
        "label": {
            "en": "Iceland"
        }
    },
    {
        "id": "IE",
        "label": {
            "en": "Ireland"
        }
    },
    {
        "id": "IT",
        "label": {
            "en": "Italy"
        }
    },
    {
        "id": "LV",
        "label": {
            "en": "Latvia"
        }
    },
    {
        "id": "LT",
        "label": {
            "en": "Lithuania"
        }
    },
    {
        "id": "NL",
        "label": {
            "en": "Netherlands"
        }
    },
    {
        "id": "NO",
        "label": {
            "en": "Norway"
        }
    },
    {
        "id": "PL",
        "label": {
            "en": "Poland"
        }
    },
    {
        "id": "PT",
        "label": {
            "en": "Portugal"
        }
    },
    {
        "id": "ES",
        "label": {
            "en": "Spain"
        }
    },
    {
        "id": "SE",
        "label": {
            "en": "Sweden"
        }
    },
    {
        "id": "CH",
        "label": {
            "en": "Switzerland"
        }
    },
    {
        "id": "GB",
        "label": {
            "en": "United Kingdom"
        }
    }
    ];

let date = addDate(new Date(), -1);
for (let i = 0; i < countries.length; i++) {
    let country = countries[i];
    let hd = holidays.isHoliday(country.id, date);
    if (hd !== false) {
        console.log(country.id, hd.date, hd.type);
    } else {
        console.log(country.id);
    }
}
*/