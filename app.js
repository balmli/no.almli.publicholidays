'use strict';

const Homey = require('homey');
const holidays = require('./lib/holidays');
const countries = require('./lib/countries');

const CRONTASK = "no.almli.publicholidays.cron";

const tokenYesterday = new Homey.FlowToken('HolidayYesterday', {type: 'string', title: 'Holiday yesterday'});
const tokenToday = new Homey.FlowToken('HolidayToday', {type: 'string', title: 'Holiday today'});
const tokenTomorrow = new Homey.FlowToken('HolidayTomorrow', {type: 'string', title: 'Holiday tomorrow'});

class HolidaysApp extends Homey.App {

    async onInit() {
        this.log('HolidaysApp is running...');

        this.addCondition('is_public_holiday', {'public': true});
        this.addCondition('is_bank_holiday', {'bank': true});
        this.addCondition('is_observance_holiday', {'observance': true});
        this.addCondition('is_holiday', {'public': true, 'bank': true});

        new Homey.FlowCardCondition('is_workingday')
            .register()
            .registerRunListener(args => this.checkWorkingDay(args))
            .getArgument('country')
            .registerAutocompleteListener((query, args) => this.onCountryAutocomplete(query, args));

        await tokenYesterday.register();
        await tokenToday.register();
        await tokenTomorrow.register();

        await this.registerTask();
        await this.onCronRun();
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

    async check(args, types) {
        if (!args.country || !args.country.id || !args.condition) {
            console.error('invalid args', args);
            return false;
        }
        let hd;
        try {
            hd = holidays.isHoliday(args.country.id, new Date(), args.condition);
            await this.updateCountry(args.country.id);
        } catch (err) {
            console.error(err);
        }
        return hd && hd.type && hd.type in types;
    }

    async checkWorkingDay(args) {
        let theDay = holidays.calcDate(new Date(), args.condition);
        let holi = await this.check(args, {
            'public': true,
            'bank': true
        });
        return theDay.getDay() >= 1 && theDay.getDay() <= 5 && !holi;
    }

    async updateCountry(countryId) {
        Homey.ManagerSettings.set('country', countryId);
        await this.onCronRun(countryId);
    }

    getCountry() {
        return Homey.ManagerSettings.get('country');
    }

    async unregisterTask() {
        try {
            await Homey.ManagerCron.unregisterTask(CRONTASK);
            this.log(`Unregistered task: ${CRONTASK}`);
        } catch (err) {
            this.log('Error unregistering task', err);
        }
    }

    async registerTask() {
        await this.unregisterTask();
        try {
            const cronTask = await Homey.ManagerCron.registerTask(CRONTASK, "0 0 * * *", {});
            cronTask.on('run', () => {
                this.onCronRun();
            });
            this.log(`Registered task: ${CRONTASK}`);
        } catch (err) {
            this.log('Error registering task', err);
        }
    }

    async onCronRun(pCountryId) {
        let countryId = pCountryId || this.getCountry();
        if (!countryId) {
            this.log('Country is not set yet.. so skip');
            return;
        }
        const today = new Date();
        await this.updateToken(countryId, today, 'yesterday', tokenYesterday);
        await this.updateToken(countryId, today, 'today', tokenToday);
        await this.updateToken(countryId, today, 'tomorrow', tokenTomorrow);
        this.log(`Updated tokens for country: ${countryId}`);
    }

    async updateToken(countryId, date, condition, token) {
        let hd = holidays.isHoliday(countryId, date, condition);
        await token.setValue(hd ? hd.name : '');
    }

}

module.exports = HolidaysApp;
