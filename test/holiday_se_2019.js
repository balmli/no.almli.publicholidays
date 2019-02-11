const expect = require("chai").expect;
const holidays = require('../lib/holidays');

describe("Swedish holidays", function () {
    describe("2019", function () {
        it("Check January", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 0, 1)).type).to.equal('public');
            expect(holidays.isHoliday('SE', new Date(2019, 0, 6)).type).to.equal('public');
            expect(holidays.isHoliday('SE', new Date(2019, 0, 13)).type).to.equal('observance');
        });

        it("Check March", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 2, 3)).type).to.equal('observance');
            expect(holidays.isHoliday('SE', new Date(2019, 2, 25)).type).to.equal('observance');
        });
        it("Check April", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 3, 19)).type).to.equal('public');
            expect(holidays.isHoliday('SE', new Date(2019, 3, 21)).type).to.equal('observance');
            expect(holidays.isHoliday('SE', new Date(2019, 3, 22)).type).to.equal('public');
            expect(holidays.isHoliday('SE', new Date(2019, 3, 30)).type).to.equal('observance');
        });
        it("Check May", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 4, 1)).type).to.equal('public');
            expect(holidays.isHoliday('SE', new Date(2019, 4, 26)).type).to.equal('observance');
        });
        it("Check June", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 5, 6)).type).to.equal('public');
            expect(holidays.isHoliday('SE', new Date(2019, 5, 9)).type).to.equal('observance');
            expect(holidays.isHoliday('SE', new Date(2019, 5, 22)).type).to.equal('public');
        });
        it("Check July", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 6, 4))).to.equal(false);
        });
        it("Check December", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 11, 10)).type).to.equal('observance');
            expect(holidays.isHoliday('SE', new Date(2019, 11, 13)).type).to.equal('observance');
            expect(holidays.isHoliday('SE', new Date(2019, 11, 24)).type).to.equal('observance');
            expect(holidays.isHoliday('SE', new Date(2019, 11, 25)).type).to.equal('public');
            expect(holidays.isHoliday('SE', new Date(2019, 11, 26)).type).to.equal('public');
            expect(holidays.isHoliday('SE', new Date(2019, 11, 31)).type).to.equal('observance');
        });
    });
});

