import Homey, {FlowToken} from 'homey';

import {countries, HolidayTypes, holidays, Holiday} from '@balmli/homey-public-holidays'

class HolidaysApp extends Homey.App {

  _deleted: Boolean = false;
  tokenYesterday?: FlowToken;
  tokenToday?: FlowToken;
  tokenTomorrow?: FlowToken;
  curTimeout: any;

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
      title: 'Holiday yesterday',
      value: ''
    });
    this.tokenToday = await this.homey.flow.createToken('HolidayToday', {
      type: 'string',
      title: 'Holiday today',
      value: ''
    });
    this.tokenTomorrow = await this.homey.flow.createToken('HolidayTomorrow', {
      type: 'string',
      title: 'Holiday tomorrow',
      value: ''
    });

    await this.scheduleJob(5);

    this.log('HolidaysApp is running...');
  }

  async onUninit() {
    this._deleted = true;
    this.clearJob();
  }

  addCondition(condition: string, types: HolidayTypes) {
    this.homey.flow.getConditionCard(condition)
      .registerRunListener(args => this.check(args, types))
      .getArgument('country')
      .registerAutocompleteListener((query: string, args: any) => this.onCountryAutocomplete(query, args));
  }

  onCountryAutocomplete(query: string, args: any) {
    return Promise.resolve(countries.filter(result => {
      return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    }));
  }

  async check(args: any, types: HolidayTypes) {
    if (!args.country || !args.country.id || !args.condition) {
      this.log('invalid args', args);
      return false;
    }
    if (args.condition === 'is_school_holiday') {
      throw new Error('Support for school holidays has been deprecated');
    }
    let hd;
    try {
      hd = holidays.isHoliday(args.country.id, this.getLocalDate(), args.condition);
      await this.updateCountry(args.country.id);
    } catch (err) {
      this.log(err);
    }
    if (hd === false) {
      return false;
    }
    const hdd = hd as Holiday;
    return hdd.type in types;
  }

  async checkWorkingDay(args: any) {
    let theDay = holidays.calcDate(this.getLocalDate(), args.condition);
    let holi = await this.check(args, {
      'public': true,
      'bank': true
    });
    return theDay.getDay() >= 1 && theDay.getDay() <= 5 && !holi;
  }

  async updateCountry(countryId: string) {
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

  async onJob(pCountryId: string) {
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

  async updateToken(countryId: string, date: Date, condition: string, token?: FlowToken) {
    if (!!token) {
      let hd = holidays.isHoliday(countryId, date, condition);
      if (hd === false) {
        token.setValue('');
      } else {
        const hdd = hd as Holiday;
        await token.setValue(hdd.name);
      }
    }
  }

  getLocalDate() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: this.homey.clock.getTimezone() }));
  }

}

module.exports = HolidaysApp;
