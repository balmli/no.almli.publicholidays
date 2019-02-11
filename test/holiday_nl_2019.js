const expect = require("chai").expect;
const holidays = require('../lib/holidays');

describe("Dutch holidays", function () {
    describe("2019", function () {
        it("Check January", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 0, 1)).type).to.equal('public');
        });
        it("Check April", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 3, 19)).type).to.equal('observance');
            expect(holidays.isHoliday('NL', new Date(2019, 3, 21)).type).to.equal('observance');
            expect(holidays.isHoliday('NL', new Date(2019, 3, 22)).type).to.equal('public');
            expect(holidays.isHoliday('NL', new Date(2019, 3, 27)).type).to.equal('public');
        });
        it("Check May", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 4, 4)).type).to.equal('public');
            expect(holidays.isHoliday('NL', new Date(2019, 4, 5)).type).to.equal('public');
            expect(holidays.isHoliday('NL', new Date(2019, 4, 12)).type).to.equal('observance');
            expect(holidays.isHoliday('NL', new Date(2019, 4, 30)).type).to.equal('public');
        });
        it("Check June", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 5, 9)).type).to.equal('observance');
            expect(holidays.isHoliday('NL', new Date(2019, 5, 10)).type).to.equal('public');
            expect(holidays.isHoliday('NL', new Date(2019, 5, 16)).type).to.equal('observance');
        });
        it("Check July", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 6, 4))).to.equal(false);
        });
        it("Check September", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 8, 17)).type).to.equal('observance');
        });
        it("Check October", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 9, 4)).type).to.equal('observance');
        });
        it("Check November", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 10, 11)).type).to.equal('observance');
        });
        it("Check December", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 11, 5)).type).to.equal('observance');
            expect(holidays.isHoliday('NL', new Date(2019, 11, 15)).type).to.equal('observance');
            expect(holidays.isHoliday('NL', new Date(2019, 11, 24))).to.equal(false);
            expect(holidays.isHoliday('NL', new Date(2019, 11, 25)).type).to.equal('public');
            expect(holidays.isHoliday('NL', new Date(2019, 11, 26)).type).to.equal('public');
            expect(holidays.isHoliday('NL', new Date(2019, 11, 31)).type).to.equal('bank');
        });
    });
});
