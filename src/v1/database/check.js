const Check = require("../models/check");
const Customer = require("../models/customer");
const Sentry = require("../../log");
const { ObjectId } = require("mongoose").Types;
const getChecks = async () => {
  const pipline = [
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  try {
    let checks = await Check.aggregate(pipline);
    console.log("checks", checks);
    return checks;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addCheck = async (
  i18n,
  checkType,
  date,
  amount,
  description,
  customer
) => {
  try {
    const newCheck = new Check({
      checkType,
      date,
      amount,
      description,
      customer,
    });

    let savedCheck = await newCheck.save();
    if (savedCheck) {
      let operator = checkType == "Check_In" ? "-" : "+";
      await Customer.findOneAndUpdate(
        { _id: ObjectId(customer) },
        { $inc: { balance: operator + amount } },
        { new: true }
      );
    }
    return savedCheck;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteCheck = async (i18n, id) => {
  try {
    const isDeletedCheck = await Check.findByIdAndRemove(id);
    if (isDeletedCheck) {
      return { message: i18n.__("check_deleted_successfully") };
    } else {
      return { message: i18n.__("failed_to_delete_customer") };
    }
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editCheck = async (
  i18n,
  checkId,
  checkType,
  date,
  amount,
  description,
  customer
) => {
  try {
    return await Check.findOneAndUpdate(
      { _id: checkId },
      {
        checkType,
        date,
        amount,
        description,
        customer,
      },
      { new: true }
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getChecks,
  addCheck,
  deleteCheck,
  editCheck,
};
