const moment = require('moment');

const rangeDate = (starDate, EndDate, DateSoms) => {
    // const starDateNew = moment(starDate);
    // const EndDateNew = moment(EndDate);
    // const DateSomsNew = moment(DateSoms);

    console.log(starDate, EndDate, DateSoms);

    if ((DateSoms >= starDate) && (DateSoms <= EndDate)) {
        console.log(true);
        return true;
    }
    console.log(false);
    return false;
} 

module.exports = rangeDate;