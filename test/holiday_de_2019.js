const expect = require("chai").expect;
const holidays = require('../lib/holidays');

describe("German holidays", function () {
    describe("2019", function () {
        it("Check 01.01.2019", function () {
            expect(holidays.isHoliday('DE', new Date(2019, 0, 1)).type).to.equal('public');
        });
        it("Check 19.04.2019", function () {
            expect(holidays.isHoliday('DE', new Date(2019, 3, 19)).type).to.equal('public');
        });
        it("Check 22.04.2019", function () {
            expect(holidays.isHoliday('DE', new Date(2019, 3, 22)).type).to.equal('public');
        });
        it("Check 01.05.2019", function () {
            expect(holidays.isHoliday('DE', new Date(2019, 4, 1)).type).to.equal('public');
        });
        it("Check 30.05.2019", function () {
            expect(holidays.isHoliday('DE', new Date(2019, 4, 30)).type).to.equal('public');
        });
        it("Check 10.06.2019", function () {
            expect(holidays.isHoliday('DE', new Date(2019, 5, 10)).type).to.equal('public');
        });
        it("Check 03.10.2019", function () {
            expect(holidays.isHoliday('DE', new Date(2019, 9, 3)).type).to.equal('public');
        });
        it("Check 25.12.2019", function () {
            expect(holidays.isHoliday('DE', new Date(2019, 11, 25)).type).to.equal('public');
        });
        it("Check 26.12.2019", function () {
            expect(holidays.isHoliday('DE', new Date(2019, 11, 26)).type).to.equal('public');
        });
    });
});
