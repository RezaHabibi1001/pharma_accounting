const Consume = require("../database/consume");
const Sentry = require("../log");
const Joi = require("joi");

const getConsumes = async () => {
  try {
    return await Consume.getConsumes();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addConsume = async (
  i18n,
  name,
  amount,
  date,
  description,
  userId
) => {
  const data = { name,amount,date , description , userId};
  const schema = Joi.object({
    name: Joi.string(),
    date: Joi.string(),
    amount: Joi.number().required(),
    description: Joi.string(),
    userId:Joi.string().required()
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Consume.addConsume(
      i18n,
      name,
      amount,
      date,
      description,
      userId
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteConsume = async (i18n, id) => {
  const data = { id };
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Consume.deleteConsume(i18n, id);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

module.exports = {
getConsumes,
addConsume,
deleteConsume
};
