const DrugType = require("../database/drugType");
const Sentry = require("../../log");
const Joi = require("joi");
const getDrugTypes = async () => {
  try {
    return await DrugType.getDrugTypes();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addDrugType = async (i18n, title) => {
  const data = { title };
  const schema = Joi.object({
    title: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await DrugType.addDrugType(i18n, title);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteDrugType = async (i18n, id) => {
  const data = { id };
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await DrugType.deleteDrugType(i18n, id);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editDrugType = async (i18n, drugTypeId, title) => {
  const data = { drugTypeId, title };
  const schema = Joi.object({
    drugTypeId: Joi.string().required(),
    title: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await DrugType.editDrugType(i18n, drugTypeId, title);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getDrugTypes,
  addDrugType,
  deleteDrugType,
  editDrugType,
};
