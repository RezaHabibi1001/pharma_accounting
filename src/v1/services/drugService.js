const Drug = require("../database/drug");
const Sentry = require("../../log");
const Joi = require("joi");

const getDrugs = async () => {
  try {
    return await Drug.getDrugs();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addDrug = async (
  i18n,
  name,
  drugType,
  company,
  country,
  amount,
  price,
  stack,
  expDate
) => {
  const data = {
    name,
    drugType,
    company,
    country,
    amount,
    price,
    stack,
    expDate,
  };
  const schema = Joi.object({
    name: Joi.string().required(),
    drugType: Joi.string().required(),
    company: Joi.string().required(),
    country: Joi.string().required(),
    amount: Joi.number().integer().required(),
    price: Joi.number().integer().required(),
    stack: Joi.string().required(),
    expDate: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Drug.addDrug(
      i18n,
      name,
      drugType,
      company,
      country,
      amount,
      price,
      stack,
      expDate
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteDrug = async (i18n, id) => {
  const data = { id };
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Drug.deleteDrug(i18n, id);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editDrug = async (
  i18n,
  drugId,
  name,
  drugType,
  company,
  country,
  amount,
  price,
  stack,
  expDate
) => {
  const data = {
    drugId,
    name,
    drugType,
    company,
    country,
    amount,
    price,
    stack,
    expDate,
  };
  const schema = Joi.object({
    drugId: Joi.string().required(),
    name: Joi.string(),
    drugType: Joi.string(),
    company: Joi.string(),
    country: Joi.string(),
    amount: Joi.number().integer(),
    price: Joi.number().integer(),
    stack: Joi.string(),
    expDate: Joi.string(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Drug.editDrug(
      i18n,
      drugId,
      name,
      drugType,
      company,
      country,
      amount,
      price,
      stack,
      expDate
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

const reportDrugs = async (
  drugType,
  drugName,
  drugCompany,
  drugCountry,
  drugStack,
  startAmount,
  endAmount,
  startPrice,
  endPrice,
  startDate,
  endDate
) => {
  try {
    return await Drug.reportDrugs(
      drugType,
      drugName,
      drugCompany,
      drugCountry,
      drugStack,
      startAmount,
      endAmount,
      startPrice,
      endPrice,
      startDate,
      endDate
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

module.exports = {
  getDrugs,
  addDrug,
  deleteDrug,
  editDrug,
  reportDrugs,
};
