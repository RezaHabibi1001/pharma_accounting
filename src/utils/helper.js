
const moment = require('moment-jalaali');

function getLastMonthHejriDate() {
  const now = moment();
  const lastMonth = now.subtract(1, 'jMonth');
  const formattedDate = lastMonth.format('jYYYY-jM-jD');
  // const formattedDateTime = `${formattedDate}T00:00:00.000+00:00`;
  return formattedDate;
}
function getCurrentHejriDate()  {
    const now = moment();
    return now.format('jYYYY-jM-jD');
  }
function getNextMonthHejriDate(dateString) {
    const date = moment(dateString, 'jYYYY-jM-jD');
    const nextMonth = date.add(1, 'jMonth');
    return nextMonth.format('jYYYY-jM-jD');
  }
  
  module.exports = {getLastMonthHejriDate , getCurrentHejriDate , getNextMonthHejriDate}