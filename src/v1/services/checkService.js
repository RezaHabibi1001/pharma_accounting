const Check = require("../database/check");
const Sentry = require("../../log");
const Joi = require("joi");
const { CheckTypeEnum } = require("../utils/enum");

const getChecks = async () => {
  try {
    return await Check.getChecks();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

const addCheck = async (
  i18n,
  checkType,
  date,
  amount,
  description,
  customer
) => {
  const data = { checkType, date, amount, description, customer };
  const schema = Joi.object({
    checkType: Joi.valid(
      CheckTypeEnum.CHECK_IN,
      CheckTypeEnum.CHECK_OUT
    ).required(),
    date: Joi.string().required(),
    amount: Joi.number().required(),
    description: Joi.string().min(0),
    customer: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Check.addCheck(
      i18n,
      checkType,
      date,
      amount,
      description,
      customer
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteCheck = async (i18n, id) => {
  const data = { id };
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Check.deleteCheck(i18n, id);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editCheck = async (
  i18n,
  checkId,
  checkType,
  date,
  amount,
  description,
  customer
) => {
  const data = {
    checkId,
    checkType,
    date,
    amount,
    description,
    customer,
  };
  const schema = Joi.object({
    checkId: Joi.string().required(),
    checkType: Joi.valid(
      CheckTypeEnum.CHECK_IN,
      CheckTypeEnum.CHECK_OUT
    ).required(),
    date: Joi.string().required(),
    amount: Joi.number().required(),
    description: Joi.string().min(0),
    customer: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Check.editCheck(
      i18n,
      checkId,
      checkType,
      date,
      amount,
      description,
      customer
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

const reportChecks = async (
  checkNumber,
  checkType,
  startDate,
  endDate,
  startAmount,
  endAmount,
  customer
) => {
  try {
    return await Check.reportChecks(
      checkNumber,
      checkType,
      startDate,
      endDate,
      startAmount,
      endAmount,
      customer
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getLastCheck = async (checkType) => {
  try {
    return await Check.getLastCheck(checkType);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getCheck = async (id) => {
  try {
    return await Check.getCheck(id);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getChecks,
  addCheck,
  deleteCheck,
  editCheck,
  reportChecks,
  getLastCheck,
  getCheck
};
