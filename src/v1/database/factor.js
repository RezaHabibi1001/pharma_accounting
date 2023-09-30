const Factor = require("../models/factor");
const Customer = require("../models/customer");
const Roznamcha = require("../models/roznamcha");
const { addRoznamcha } = require("./roznamcha");
const { changeExistance, rollbackDrug } = require("./drug");
const Sentry = require("../../log");
const { ObjectId } = require("mongoose").Types;
const { FactorTypeEnum, PaymentTypeEnum } = require("../utils/enum");
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
    await changeExistance(items, factorType);

    return savedFactor;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteFactor = async (i18n, id) => {
  try {
    const {
      amount,
      customer,
      factorType,
      paymentType,
      buyFactorNumber,
      sellFactorNumber,
      items,
    } = await Factor.findById(id);
    const { balance } = await Customer.findById({ _id: customer });
    if (factorType == FactorTypeEnum.BUY) {
      const isDeletedRoznamcha = await Roznamcha.findOneAndRemove({
        bellType: FactorTypeEnum.BUY,
        bellNumber: buyFactorNumber,
      });
      if (paymentType == PaymentTypeEnum.NO_CASH) {
        const updatedCustomer = await Customer.findOneAndUpdate(
          { _id: customer },
          { balance: balance - amount }
        );
      }
    }
    if (factorType == FactorTypeEnum.SELL) {
      const isDeletedRoznamcha = await Roznamcha.findOneAndRemove({
        bellType: FactorTypeEnum.SELL,
        bellNumber: sellFactorNumber,
      });
      if (paymentType == PaymentTypeEnum.NO_CASH) {
        const updatedCustomer = await Customer.findOneAndUpdate(
          { _id: customer },
          { balance: balance + amount }
        );
      }
    }
    await rollbackDrug(items, factorType);
    const isDeletedFactor = await Factor.findByIdAndRemove(id);
    if (isDeletedFactor) {
      return { message: i18n.__("factor_deleted_successfully") };
    }
    return { message: i18n.__("failed_to_delete_factor") };
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
const getLastFactor = async factorType => {
  const pipline = [
    { $match: { factorType } },
    { $sort: { createdAt: -1 } },
    { $limit: 1 },
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
      $lookup: {
        from: "drugs",
        localField: "items.drug",
        foreignField: "_id",
        as: "drug",
      },
    },
    {
      $unwind: {
        path: "$drug",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        buyFactorNumber: 1,
        sellFactorNumber: 1,
        factorType: 1,
        paymentType: 1,
        date: 1,
        amount: 1,
        description: 1,
        customer: "$customer",
        "items.quantity": 1,
        "items.price": 1,
        "items.total": 1,
        "items.description": 1,
        "items.drug": "$drug",
      },
    },
  ];
  try {
    let factors = await Factor.aggregate(pipline);
    return factors[0];
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const reportFactors = async (
  factorType,
  paymentType,
  customer,
  drug,
  startDate,
  endDate,
  startAmount,
  endAmount
) => {
  const filters = [{}];
  factorType && filters.push({ factorType });
  paymentType && filters.push({ paymentType });
  customer && filters.push({ customer: ObjectId(customer) });
  drug && filters.push({ "items.drug": ObjectId(drug) });

  if (startAmount || endAmount) {
    if (startAmount && endAmount) {
      filters.push({
        amount: { $gte: startAmount, $lte: endAmount },
      });
    } else if (startAmount) {
      filters.push({ amount: { $gte: startAmount } });
    } else if (endAmount) {
      filters.push({ amount: { $lte: endAmount } });
    }
  }

  if (startDate || endDate) {
    if (startDate && endDate) {
      filters.push({
        date: { $gte: startDate, $lte: endDate },
      });
    } else if (startDate) {
      filters.push({ date: { $gte: startDate } });
    } else if (endDate) {
      filters.push({ date: { $lte: endDate } });
    }
  }
  const pipline = [
    {
      $match: { $and: filters },
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
  ];
  try {
    let factors = await Factor.aggregate(pipline);
    return factors;
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
  getLastFactor,
  reportFactors,
};
