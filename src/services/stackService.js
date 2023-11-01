const Stack = require("../database/stack");
const Sentry = require("../log");
const Joi = require("joi");
const getStacks = async () => {
  try {
    return await Stack.getStacks();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addStack = async (i18n, name, type, address) => {
  const data = { name, type, address };
  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    address: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Stack.addStack(i18n, name, type, address);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteStack = async (i18n, id) => {
  const data = { id };
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Stack.deleteStack(i18n, id);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editStack = async (i18n, stackId, name, type, address) => {
  const data = { stackId, name, type, address };
  const schema = Joi.object({
    stackId: Joi.string().required(),
    name: Joi.string(),
    type: Joi.string(),
    address: Joi.string(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Stack.editStack(i18n, stackId, name, type, address);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getStacks,
  addStack,
  deleteStack,
  editStack,
};
