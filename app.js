'use strict';

const Homey = require('homey');
const holidays = require('./lib/holidays');
const countries = require('./lib/countries');

class HolidaysApp extends Homey.App {

    onInit() {
        this.log('HolidaysApp is running...');

        this.addCondition('is_public_holiday', {'public': true});
        this.addCondition('is_bank_holiday', {'bank': true});
        this.addCondition('is_observance_holiday', {'observance': true});
        this.addCondition('is_holiday', {'public': true, 'bank': true});

        new Homey.FlowCardCondition('is_workingday')
            .register()
            .registerRunListener(args => {
                let theDay = holidays.calcDate(new Date(), args.condition);
                return theDay.getDay() >= 1 && theDay.getDay() <= 5 && !this.check(args, {
                    'public': true,
                    'bank': true
                });
            })
            .getArgument('country')
            .registerAutocompleteListener((query, args) => this.onCountryAutocomplete(query, args));
    }

    addCondition(condition, types) {
        new Homey.FlowCardCondition(condition)
            .register()
            .registerRunListener(args => this.check(args, types))
            .getArgument('country')
            .registerAutocompleteListener((query, args) => this.onCountryAutocomplete(query, args));
    }

    onCountryAutocomplete(query, args) {
        return Promise.resolve(countries.filter(result => {
            return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
        }));
    }

    check(args, types) {
        if (!args.country || !args.country.id || !args.condition) {
            console.error('invalid args', args);
            return false;
        }
        let hd;
        try {
            hd = holidays.isHoliday(args.country.id, new Date(), args.condition);
        } catch (err) {
            console.error(err);
        }
        return hd && hd.type && hd.type in types;
    }

}

module.exports = HolidaysApp;
