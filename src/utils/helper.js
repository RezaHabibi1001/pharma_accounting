
const moment = require('moment-jalaali');

function getLastMonthHejriDate() {
  const now = moment();
  const lastMonth = now.subtract(1, 'jMonth');
  const formattedDate = lastMonth.format('jYYYY-jMM-jDD');
  // const formattedDateTime = `${formattedDate}T00:00:00.000+00:00`;
  return formattedDate;
}
function getCurrentHejriDate()  {
    const now = moment();
    return now.format('jYYYY-jMM-jDD');
  }
function getNextMonthHejriDate(dateString) {
    const date = moment(dateString, 'jYYYY-jMM-jDD');
    const nextMonth = date.add(1, 'jMonth');
    return nextMonth.format('jYYYY-jMM-jDD');
  }
  function getNextSomeMonth(contractDate , number) {
    const date = moment(contractDate, 'jYYYY-jMM-jDD');
    const nextMonth = date.add(number, 'jMonth');
    return nextMonth.format('jYYYY-jMM-jDD');
  }
  
  
  module.exports = {getLastMonthHejriDate , getCurrentHejriDate , getNextMonthHejriDate , getNextSomeMonth}