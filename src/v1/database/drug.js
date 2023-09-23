const Drug = require("../models/drug");
const Factor = require("../models/factor");
const Sentry = require("../../log");
const { ObjectId } = require("mongoose").Types;

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
    const factorItemExistWithDrug = await Factor.findOne({
      "items.drug": ObjectId(id),
    });
    console.log("factorItemExistWithDrug", factorItemExistWithDrug);
    if (factorItemExistWithDrug) {
      return { message: i18n.__("delete_factor_before_delete_drug") };
    }
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
const reportDrugs = async (
  drugType,
  drugName,
  drugCompany,
  drugCountry,
  drugStack,
  startAmount,
  endAmount,
  startPrice,
  endPrice,
  startDate,
  endDate
) => {
  const filters = [{}];
  drugType && filters.push({ drugType: ObjectId(drugType) });
  drugName && filters.push({ name: drugName });
  drugCompany && filters.push({ company: drugCompany });
  drugCountry && filters.push({ country: drugCountry });
  drugStack && filters.push({ stack: ObjectId(drugStack) });

  if (startAmount || endAmount) {
    if (startAmount && endAmount) {
      filters.push({
        amount: { $gte: startAmount, $lte: endAmount },
      });
    } else if (startDate) {
      filters.push({ amount: { $gte: startAmount } });
    } else if (endDate) {
      filters.push({ amount: { $lte: endAmount } });
    }
  }
  if (startPrice || endPrice) {
    if (startPrice && endPrice) {
      filters.push({
        price: { $gte: startPrice, $lte: endPrice },
      });
    } else if (startDate) {
      filters.push({ price: { $gte: startPrice } });
    } else if (endDate) {
      filters.push({ price: { $lte: endPrice } });
    }
  }
  if (startDate || endDate) {
    if (startDate && endDate) {
      filters.push({
        expDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });
    } else if (startDate) {
      filters.push({ expDate: { $gte: startDate } });
    } else if (endDate) {
      filters.push({ expDate: { $lte: endDate } });
    }
  }
  const pipline = [
    {
      $match: { $and: filters },
    },
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
module.exports = {
  getDrugs,
  addDrug,
  deleteDrug,
  editDrug,
  changeExistance,
  reportDrugs,
};
