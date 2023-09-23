const DrugType = require("../models/drugType");
const Drug = require("../models/drug");
const Sentry = require("../../log");
const { ObjectId } = require("mongoose").Types;

const getDrugTypes = async () => {
  try {
    return await DrugType.find();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addDrugType = async (i18n, title) => {
  let drugTypeAlreadyExist = await DrugType.findOne({
    title,
  });
  if (drugTypeAlreadyExist) {
    throw new Error(i18n.__("drugType_already_exist"));
  }
  try {
    const newDrugType = new DrugType({
      title,
    });
    return await newDrugType.save();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteDrugType = async (i18n, id) => {
  try {
    const drugExistWithDrugType = await Drug.findOne({
      drugType: ObjectId(id),
    });
    console.log("drugExistWithDrugType", drugExistWithDrugType);
    if (drugExistWithDrugType) {
      return { message: i18n.__("delete_drugs_before_delete_drugType") };
    }
    const isDeletedDrugType = await DrugType.findByIdAndRemove(id);
    if (isDeletedDrugType) {
      return { message: i18n.__("drugType_deleted_successfully") };
    } else {
      return { message: i18n.__("failed_to_delete_drugType") };
    }
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editDrugType = async (i18n, drugTypeId, title) => {
  let drugTypeAlreadyExist = await DrugType.findOne({
    title,
    _id: { $nin: drugTypeId },
  });
  if (drugTypeAlreadyExist) {
    throw new Error(i18n.__("drugType_already_exist"));
  }
  try {
    return await DrugType.findOneAndUpdate(
      { _id: drugTypeId },
      {
        title,
      },
      { new: true }
    );
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
