const Factor = require("../models/factor");
const Customer = require("../models/customer");
const { addRoznamcha } = require("./roznamcha");
const Sentry = require("../../log");
const { ObjectId } = require("mongoose").Types;
const getFactors = async () => {
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
    let factors = await Factor.aggregate(pipline);
    return factors;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addFactor = async (
  i18n,
  factorType,
  paymentType,
  date,
  amount,
  description,
  customer,
  items
) => {
  try {
    const newFactor = new Factor({
      factorType,
      paymentType,
      date,
      amount,
      description,
      customer,
      items,
    });

    let operator;
    if (paymentType == "No_Cash") {
      if (factorType == "Buy") {
        operator = "+";
      } else if (factorType == "Sell") {
        operator = "-";
      }
    }
    if (operator) {
      await Customer.findOneAndUpdate(
        { _id: ObjectId(customer) },
        { $inc: { balance: operator + amount } },
        { new: true }
      );
    }
    let savedFactor = await newFactor.save();
    let bellNumber =
      savedFactor.factorType == "Buy"
        ? savedFactor.buyFactorNumber
        : savedFactor.sellFactorNumber;
    let bellType = factorType;
    await addRoznamcha(bellNumber, bellType, date, amount, customer);

    return savedFactor;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteFactor = async (i18n, id) => {
  try {
    const isDeletedFactor = await Factor.findByIdAndRemove(id);
    if (isDeletedFactor) {
      return { message: i18n.__("factor_deleted_successfully") };
    } else {
      return { message: i18n.__("failed_to_delete_factor") };
    }
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editFactor = async (
  i18n,
  factorId,
  factorType,
  paymentType,
  date,
  amount,
  description,
  customer,
  items
) => {
  try {
    return await Factor.findOneAndUpdate(
      { _id: factorId },
      {
        factorType,
        paymentType,
        date,
        amount,
        description,
        customer,
        items,
      },
      { new: true }
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getFactors,
  addFactor,
  deleteFactor,
  editFactor,
};
