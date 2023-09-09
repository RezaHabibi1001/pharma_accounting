const Employee = require("../database/employee");
const Sentry = require("../../log");
const Joi = require("joi");

const getEmployees = async () => {
  try {
    return await Employee.getEmployees();
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
  const data = {
    fullName,
    phoneNumber,
    job,
    contractDate,
    workTime,
    salary,
  };
  const schema = Joi.object({
    fullName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    job: Joi.string().required(),
    contractDate: Joi.string(),
    workTime: Joi.string().required(),
    salary: Joi.number().integer().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Employee.addEmployee(
      i18n,
      fullName,
      phoneNumber,
      job,
      contractDate,
      workTime,
      salary
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteEmployee = async (i18n, id) => {
  const data = { id };
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Employee.deleteEmployee(i18n, id);
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
  const data = {
    employeeId,
    fullName,
    phoneNumber,
    job,
    contractDate,
    workTime,
    salary,
  };
  const schema = Joi.object({
    employeeId: Joi.string().required(),
    fullName: Joi.string(),
    phoneNumber: Joi.number(),
    job: Joi.string(),
    contractDate: Joi.string(),
    workTime: Joi.string(),
    salary: Joi.number().integer(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Employee.editEmployee(
      i18n,
      employeeId,
      fullName,
      phoneNumber,
      job,
      contractDate,
      workTime,
      salary
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
