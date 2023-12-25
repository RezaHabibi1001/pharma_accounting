const Employee = require("../models/employee");
const Sentry = require("../log");
const {getLastMonthHejriDate , getCurrentHejriDate , getNextMonthHejriDate ,  getNextSomeMonth} =  require("../utils/helper")
const moment = require('moment-jalaali');

const getEmployees = async () => {
  try {
    const pipline =[
      {
        $sort:{
          fullName:1
        }
      }
    ]
    return await Employee.aggregate(pipline);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addEmployee = async (
  i18n,
  fullName,
  phoneNumber,
  job,
  contractDate,
  workTime,
  salary
) => {
  try {
    const date1 = moment(getCurrentHejriDate(), 'jYYYY-jMM-jDD');
    const date2 = moment(contractDate, 'jYYYY-jMM-jDD');
    const differenceInMonths = date1.diff(date2, 'months');
    const lastPaymentDate = getNextSomeMonth(contractDate , differenceInMonths)

    const newEmployee = new Employee({
      fullName,
      phoneNumber,
      job,
      contractDate,
      workTime,
      salary,
      balance:salary*differenceInMonths,
      lastPaymentDate:lastPaymentDate
    });
    return await newEmployee.save();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteEmployee = async (i18n, id) => {
  try {
    const isDeletedEmployee = await Employee.findByIdAndRemove(id);
    if (isDeletedEmployee) {
      return { message: i18n.__("employee_deleted_successfully") };
    } else {
      return { message: i18n.__("failed_to_delete_employee") };
    }
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editEmployee = async (
  i18n,
  employeeId,
  fullName,
  phoneNumber,
  job,
  contractDate,
  workTime,
  salary
) => {
  try {
    return await Employee.findOneAndUpdate(
      { _id: employeeId },
      {
        fullName,
        phoneNumber,
        job,
        contractDate,
        workTime,
        salary,
      },
      { new: true }
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getEmployees,
  addEmployee,
  deleteEmployee,
  editEmployee,
};
