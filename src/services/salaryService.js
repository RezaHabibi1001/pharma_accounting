const Salary = require("../database/salary");
const Sentry = require("../log");
const Joi = require("joi");

const getSalaries = async (employeeId) => {
  try {
    return await Salary.getSalaries(employeeId);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

const addSalary = async (
  i18n,
  employeeId,
  amount,
  date,
  description
) => {
  const data = { employeeId,amount,date , description};
  const schema = Joi.object({
    employeeId: Joi.string().required(),
    date: Joi.string().required(),
    amount: Joi.number().required(),
    description: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Salary.addSalary(
      i18n,
      employeeId,
      amount,
      date,
      description
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteSalary = async (i18n, id) => {
  const data = { id };
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Salary.deleteSalary(i18n, id);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

module.exports = {
getSalaries,
addSalary,
deleteSalary
};
