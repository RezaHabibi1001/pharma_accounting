const Factor = require("../database/factor");
const Sentry = require("../../log");
const Joi = require("joi");
const { FactorTypeEnum, PaymentTypeEnum } = require("../utils/enum");

const getFactors = async () => {
  try {
    return await Factor.getFactors();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

const addFactor = async (
  i18n,
  factorType,
  paymentType,
  date,
  amount,
  description,
  customer,
  items
) => {
  const data = {
    factorType,
    paymentType,
    date,
    amount,
    description,
    customer,
    items,
  };
  console.log(data);
  const schema = Joi.object({
    factorType: Joi.valid(FactorTypeEnum.BUY, FactorTypeEnum.SELL).required(),
    paymentType: Joi.valid(
      PaymentTypeEnum.CASH,
      PaymentTypeEnum.NO_CASH
    ).required(),
    date: Joi.string().required(),
    amount: Joi.number().integer().required(),
    description: Joi.string(),
    customer: Joi.string().required(),
    items: Joi.array().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }

  try {
    return await Factor.addFactor(
      i18n,
      factorType,
      paymentType,
      date,
      amount,
      description,
      customer,
      items
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteFactor = async (i18n, id) => {
  const data = { id };
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Factor.deleteFactor(i18n, id);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editFactor = async (
  i18n,
  factorId,
  factorType,
  paymentType,
  date,
  amount,
  description,
  customer,
  items
) => {
  const data = {
    factorId,
    factorType,
    paymentType,
    date,
    amount,
    description,
    customer,
    items,
  };
  const schema = Joi.object({
    factorId: Joi.string().required(),
    factorType: Joi.valid(FactorTypeEnum.BUY, FactorTypeEnum.SELL).required(),
    paymentType: Joi.valid(
      PaymentTypeEnum.CASH,
      PaymentTypeEnum.NO_CASH
    ).required(),
    date: Joi.string().required(),
    amount: Joi.number().integer().required(),
    description: Joi.string(),
    customer: Joi.string().required(),
    items: Joi.array().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Factor.editFactor(
      i18n,
      factorId,
      factorType,
      paymentType,
      date,
      amount,
      description,
      customer,
      items
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getLastFactor = async factorType => {
  const data = { factorType };
  const schema = Joi.object({
    factorType: Joi.valid(FactorTypeEnum.BUY, FactorTypeEnum.SELL).required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Factor.getLastFactor(factorType);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getFactors,
  addFactor,
  deleteFactor,
  editFactor,
  getLastFactor,
};
