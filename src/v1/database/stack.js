const Stack = require("../models/stack");
const Drug = require("../models/drug");
const Sentry = require("../../log");
const { ObjectId } = require("mongoose").Types;

const getStacks = async () => {
  try {
    return await Stack.find();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addStack = async (i18n, name, type, address) => {
  let stackAlreadyExist = await Stack.findOne({
    name,
  });
  if (stackAlreadyExist) {
    throw new Error(i18n.__("stack_already_exist"));
  }
  try {
    const newStack = new Stack({
      name,
      type,
      address,
    });
    return await newStack.save();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteStack = async (i18n, id) => {
  try {
    const drugExistWithStack = await Drug.findOne({
      stack: ObjectId(id),
    });
    if (drugExistWithStack) {
      return { message: i18n.__("delete_drugs_before_delete_stack") };
    }
    const isStackDeleted = await Stack.findByIdAndRemove(id);
    if (isStackDeleted) {
      return { message: i18n.__("stack_deleted_successfully") };
    } else {
      return { message: i18n.__("failed_to_delete_stacj") };
    }
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editStack = async (i18n, stackId, name, type, address) => {
  let stackAlreadyExist = await Stack.findOne({
    name,
    _id: { $nin: stackId },
  });
  if (stackAlreadyExist) {
    throw new Error(i18n.__("stack_already_exist"));
  }
  try {
    return await Stack.findOneAndUpdate(
      { _id: stackId },
      {
        name,
        type,
        address,
      },
      { new: true }
    );
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
