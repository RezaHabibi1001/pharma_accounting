const Period = require("../database/period");
const Sentry = require("../log");
const Joi = require("joi");

const getPeriods = async () => {
  try {
    return await Period.getPeriods();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addPeriod = async (i18n, name) => {
  const data = { name };
  const schema = Joi.object({
    name: Joi.string().required()
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Period.addPeriod(i18n, name);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deletePeriod = async (i18n, id) => {
  const data = { id };
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Period.deletePeriod(i18n, id);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editPeriod = async (i18n, periodId, name, isClosed) => {
  const data = { periodId, name,isClosed };
  const schema = Joi.object({
    periodId: Joi.string().required(),
    name: Joi.string(),
    isClosed:Joi.boolean()
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Period.editPeriod(i18n, periodId, name,isClosed);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getPeriods,
  addPeriod,
  deletePeriod,
  editPeriod,
};
