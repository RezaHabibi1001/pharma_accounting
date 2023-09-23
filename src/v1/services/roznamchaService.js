const Roznamcha = require("../database/roznamcha");
const Sentry = require("../../log");
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
module.exports = {
  getRoznamcha,
};
