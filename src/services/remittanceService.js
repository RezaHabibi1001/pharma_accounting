const Remittance = require("../database/remittance");
const Sentry = require("../log");
const Joi = require("joi");
const { RemittanceEnum } = require("../utils/enum");

const getRemittances = async () => {
  try {
    return await Remittance.getRemittances();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addRemittance = async (
  i18n,
  number,
  type,
  amount,
  customerName,
  shopAddress,
  via,
  description,
  date
) => {
  const data = {
    number,
    type,
    amount,
    customerName,
    shopAddress,
    via,
    description,
    date,
  };
  const schema = Joi.object({
    number: Joi.string().required(),
    amount: Joi.number().required(),
    customerName: Joi.string().required(),
    shopAddress: Joi.string().required(),
    via: Joi.string().required(),
    description: Joi.string().min(0),
    date: Joi.string().required(),
    type: Joi.valid(RemittanceEnum.CARD_TO_CARD, RemittanceEnum.EXCHANGE),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Remittance.addRemittance(
      i18n,
      number,
      type,
      amount,
      customerName,
      shopAddress,
      via,
      description,
      date
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteRemittance = async (i18n, id) => {
  const data = { id };
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Remittance.deleteRemittance(i18n, id);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editRemittance = async (
  i18n,
  remittanceId,
  number,
  type,
  amount,
  customerName,
  shopAddress,
  via,
  description,
  date
) => {
  const data = {
    remittanceId,
    number,
    type,
    amount,
    customerName,
    shopAddress,
    via,
    description,
    date,
  };
  const schema = Joi.object({
    remittanceId: Joi.string().required(),
    number: Joi.string(),
    amount: Joi.number(),
    customerName: Joi.string(),
    shopAddress: Joi.string(),
    via: Joi.string(),
    description: Joi.string().min(0),
    date: Joi.string(),
    type: Joi.valid(RemittanceEnum.CARD_TO_CARD, RemittanceEnum.EXCHANGE),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Remittance.editRemittance(
      i18n,
      remittanceId,
      number,
      type,
      amount,
      customerName,
      shopAddress,
      via,
      description,
      date
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getRemittances,
  addRemittance,
  deleteRemittance,
  editRemittance,
};
