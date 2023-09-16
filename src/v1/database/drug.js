const Drug = require("../models/drug");
const Sentry = require("../../log");

const getDrugs = async () => {
  const pipline = [
    {
      $lookup: {
        from: "drugtypes",
        localField: "drugType",
        foreignField: "_id",
        as: "drugType",
      },
    },
    {
      $unwind: {
        path: "$drugType",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "stacks",
        localField: "stack",
        foreignField: "_id",
        as: "stack",
      },
    },
    {
      $unwind: {
        path: "$stack",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  try {
    let drugs = await Drug.aggregate(pipline);
    console.log("drugs", drugs);
    return drugs;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addDrug = async (
  i18n,
  name,
  drugType,
  company,
  country,
  amount,
  price,
  stack,
  expDate
) => {
  try {
    const newDrug = new Drug({
      name,
      drugType,
      company,
      country,
      amount,
      price,
      stack,
      expDate,
    });
    return await newDrug.save();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteDrug = async (i18n, id) => {
  try {
    const isDeletedDrug = await Drug.findByIdAndRemove(id);
    if (isDeletedDrug) {
      return { message: i18n.__("drug_deleted_successfully") };
    } else {
      return { message: i18n.__("failed_to_delete_drug") };
    }
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editDrug = async (
  i18n,
  drugId,
  name,
  drugType,
  company,
  country,
  amount,
  price,
  stack,
  expDate
) => {
  try {
    return await Drug.findOneAndUpdate(
      { _id: drugId },
      {
        name,
        drugType,
        company,
        country,
        amount,
        price,
        stack,
        expDate,
      },
      { new: true }
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const changeExistance = async items => {
  try {
    let drugIds = items.map(async item => {
      await Drug.findOneAndUpdate(
        { _id: item.drug },
        { $inc: { amount: -item.quantity } },
        { new: true }
      );
    });
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getDrugs,
  addDrug,
  deleteDrug,
  editDrug,
  changeExistance,
};
