const Period = require("../models/period");
const Sentry = require("../log");
const { ObjectId } = require("mongoose").Types;

const getPeriods = async () => {
  try {
    const pipline = [{$sort:{ createdAt:-1}}]
    return await Period.aggregate(pipline);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addPeriod = async (i18n, name) => {
  let periodAlreadyExist = await Period.findOne({
    name,
  });
  if (periodAlreadyExist) {
    throw new Error(i18n.__("period_already_exist"));
  }
  try {
    const newPeriod = new Period({name});
    return await newPeriod.save();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deletePeriod = async (i18n, id) => {
  try {

    const isPeriodDeleted = await Period.findByIdAndRemove(id);
    if (isPeriodDeleted) {
      return { message: i18n.__("period_deleted_successfully") };
    } else {
      return { message: i18n.__("failed_to_delete_period") };
    }
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editPeriod = async (i18n, periodId, name, isClosed) => {
  let periodAlreadyExist = await Period.findOne({
    name,
    _id: { $nin: periodId },
  });
  if (periodAlreadyExist) {
    throw new Error(i18n.__("period_already_exist"));
  }
  try {
    return await Period.findOneAndUpdate(
      { _id: periodId },
      {
        name,
        isClosed
      },
      { new: true }
    );
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
