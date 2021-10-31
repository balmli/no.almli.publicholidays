'use strict';

const Homey = require('homey');
const holidays = require('./lib/holidays');
const countries = require('./lib/countries');

class HolidaysApp extends Homey.App {

  async onInit() {

    this.addCondition('is_public_holiday', { 'public': true });
    this.addCondition('is_bank_holiday', { 'bank': true });
    this.addCondition('is_observance_holiday', { 'observance': true });
    this.addCondition('is_school_holiday', { 'school': true });
    this.addCondition('is_holiday', { 'public': true, 'bank': true });

    this.homey.flow.getConditionCard('is_workingday')
      .registerRunListener(args => this.checkWorkingDay(args))
      .getArgument('country')
      .registerAutocompleteListener((query, args) => this.onCountryAutocomplete(query, args));

    this.tokenYesterday = await this.homey.flow.createToken('HolidayYesterday', {
      type: 'string',
      title: 'Holiday yesterday'
    });
    this.tokenToday = await this.homey.flow.createToken('HolidayToday', {
      type: 'string',
      title: 'Holiday today'
    });
    this.tokenTomorrow = await this.homey.flow.createToken('HolidayTomorrow', {
      type: 'string',
      title: 'Holiday tomorrow'
    });

    await this.scheduleJob(5);

    this.log('HolidaysApp is running...');
  }

  async onUninit() {
    this._deleted = true;
    this.clearJob();
  }

  addCondition(condition, types) {
    this.homey.flow.getConditionCard(condition)
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
      this.log('invalid args', args);
      return false;
    }
    let hd;
    try {
      hd = holidays.isHoliday(args.country.id, this.getLocalDate(), args.condition);
      await this.updateCountry(args.country.id);
    } catch (err) {
      this.log(err);
    }
    return hd && hd.type && hd.type in types;
  }

  async checkWorkingDay(args) {
    let theDay = holidays.calcDate(this.getLocalDate(), args.condition);
    let holi = await this.check(args, {
      'public': true,
      'bank': true
    });
    return theDay.getDay() >= 1 && theDay.getDay() <= 5 && !holi;
  }

  async updateCountry(countryId) {
    this.homey.settings.set('country', countryId);
    await this.onJob(countryId);
  }

  getCountry() {
    return this.homey.settings.get('country');
  }

  clearJob() {
    if (this.curTimeout) {
      this.homey.clearTimeout(this.curTimeout);
      this.curTimeout = undefined;
    }
  }

  async scheduleJob(interval = 60) {
    if (this._deleted) {
      return;
    }
    this.clearJob();
    this.curTimeout = this.homey.setTimeout(this.onJob.bind(this), interval * 1000);
  }

  async onJob(pCountryId) {
    if (this._deleted) {
      return;
    }
    try {
      let countryId = pCountryId || this.getCountry();
      if (!countryId) {
        this.log('Country is not set yet.. so skip');
        return;
      }
      const today = this.getLocalDate();
      await this.updateToken(countryId, today, 'yesterday', this.tokenYesterday);
      await this.updateToken(countryId, today, 'today', this.tokenToday);
      await this.updateToken(countryId, today, 'tomorrow', this.tokenTomorrow);
      this.log(`Updated tokens for country: ${countryId}`);
    } catch (err) {
      this.log('onJob error', err);
    } finally {
      this.scheduleJob();
    }
  }

  async updateToken(countryId, date, condition, token) {
    let hd = holidays.isHoliday(countryId, date, condition);
    await token.setValue(hd ? hd.name : '');
  }

  getLocalDate() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: this.homey.clock.getTimezone() }));
  }

}

module.exports = HolidaysApp;
