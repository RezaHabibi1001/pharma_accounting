const Roznamcha = require("../database/roznamcha");
const Sentry = require("../log");
const Joi = require("joi");

const getRoznamcha = async date => {
  const data = { date };
  const schema = Joi.object({
    date: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Roznamcha.getRoznamcha(date);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getRepository = async date => {
  const data = { date };
  try {
    return await Roznamcha.getRepository();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getStatistic = async date => {
  const data = { date };
  try {
    return await Roznamcha.getStatistic();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getBackup = async (i18n , dbName) => {
  try {
    return await Roznamcha.getBackup(i18n,dbName);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getRoznamcha,
  getRepository,
  getStatistic,
  getBackup
};
