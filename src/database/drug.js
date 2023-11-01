const Drug = require("../models/drug");
const Factor = require("../models/factor");
const Sentry = require("../log");
const { ObjectId } = require("mongoose").Types;
const { FactorTypeEnum } = require("../utils/enum");
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
    {
      $sort: {
        'drugType.title': 1
      }
    },
  ];
  try {
    let drugs = await Drug.aggregate(pipline);
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
const changeExistance = async (items, factorType) => {
  try {
    if (factorType == FactorTypeEnum.SELL) {
      items.map(async item => {
        await Drug.findOneAndUpdate(
          { _id: item.drug },
          { $inc: { amount: -item.quantity } },
          { new: true }
        );
      });
    }
    if (factorType == FactorTypeEnum.BUY) {
      items.map(async item => {
        await Drug.findOneAndUpdate(
          { _id: item.drug },
          { $inc: { amount: item.quantity } },
          { new: true }
        );
      });
    }
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const changePrice = async (items) => {
  try {
      items.map(async item => {
        await Drug.findOneAndUpdate(
          { _id: item.drug },
          { $set: { price: item.price } },
          { new: true }
        );
      });
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const rollbackDrug = async (items, factorType) => {
  try {
    if (factorType == FactorTypeEnum.SELL) {
      items.map(async item => {
        await Drug.findOneAndUpdate(
          { _id: item.drug },
          { $inc: { amount: item.quantity } },
          { new: true }
        );
      });
    }
    if (factorType == FactorTypeEnum.BUY) {
      items.map(async item => {
        await Drug.findOneAndUpdate(
          { _id: item.drug },
          { $inc: { amount: -item.quantity } },
          { new: true }
        );
      });
    }
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

  if  ( typeof startAmount === "number" || typeof endAmount === "number") {
    if ( typeof startAmount === "number" && typeof endAmount === "number") {
      filters.push({
        amount: { $gte: startAmount, $lte: endAmount },
      });
    } else if ( typeof startAmount === "number") {
      filters.push({ amount: { $gte: startAmount } });
    } else if (typeof endAmount === "number") {
      filters.push({ amount: { $lte: endAmount } });
    }
  }
  if ( typeof startPrice === "number" ||  typeof endPrice === "number") {
    if ( typeof startPrice === "number" &&  typeof endPrice === "number") {
      filters.push({
        price: { $gte: startPrice, $lte: endPrice },
      });
    } else if ( typeof startPrice === "number" ) {
      filters.push({ price: { $gte: startPrice } });
    } else if ( typeof endPrice === "number" ) {
      filters.push({ price: { $lte: endPrice } });
    }
  }
  if (startDate || endDate) {
    if (startDate && endDate) {
      filters.push({
        expDate: { $gte: startDate, $lte:endDate },
      });
    } else if (startDate) {
      filters.push({ expDate: { $gte:startDate } });
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
    return drugs;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getDrugDetails = async (i18n, id) => {
  const pipeline = [
    {
      $match: { "items.drug": ObjectId(id) },
    },
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
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "drugs",
        localField: "items.drug",
        foreignField: "_id",
        as: "items.drug",
      },
    },
    {
      $unwind: "$items.drug",
    },
    {
      $lookup: {
        from: "drugtypes",
        localField: "items.drug.drugType",
        foreignField: "_id",
        as: "items.drug.drugType",
      },
    },
    {
      $unwind: "$items.drug.drugType",
    },
    {
      $match: { "items.drug._id": ObjectId(id) }, // Add this stage to match the specific drug ID
    },
    {
      $group: {
        _id: "$_id",
        buyFactorNumber: { $first: "$buyFactorNumber" },
        sellFactorNumber: { $first: "$sellFactorNumber" },
        factorType: { $first: "$factorType" },
        paymentType: { $first: "$paymentType" },
        date: { $first: "$date" },
        amount: { $first: "$amount" },
        description: { $first: "$description" },
        customer: { $first: "$customer" },
        items: { $push: "$items" },
      },
    },
  ];
  

  try {
    const factors = await Factor.aggregate(pipeline);
    if (factors.length === 0) {
      return new Error(i18n.__("no_factor_found_for_this_drug"));
    }
    return factors;
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
  rollbackDrug,
  changePrice,
  getDrugDetails
};
