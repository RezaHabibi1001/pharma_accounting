const Roznamcha = require("../database/roznamcha");
const Sentry = require("../../log");
const Joi = require("joi");

const getRoznamcha = async () => {
  try {
    return await Roznamcha.getRoznamcha();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getRoznamcha,
};
