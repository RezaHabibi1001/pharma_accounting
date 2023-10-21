const Check = require("../models/check");
const Customer = require("../models/customer");
const Roznamcha = require("../models/roznamcha");
const Sentry = require("../../log");
const { addRoznamcha } = require("./roznamcha");
const { ObjectId } = require("mongoose").Types;
const { CheckTypeEnum } = require("../utils/enum");
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
    let providedData = {
      checkType,
      date,
      amount,
      description,
      customer,
    }
    const lastCheck  =  await Check.find({checkType}).sort({createdAt:-1}).limit(1)
    console.log("lastCheck" ,  lastCheck[0]);
    if(lastCheck[0]) {
    if(checkType == CheckTypeEnum.CHECK_IN) {
      providedData.checkInNumber = lastCheck[0].checkInNumber+1
    }else if(checkType == CheckTypeEnum.CHECK_OUT) {
      providedData.checkOutNumber = lastCheck[0].checkOutNumber+1
    }
  }else {
    if(checkType == CheckTypeEnum.CHECK_IN) {
      providedData.checkInNumber = 1
    }else if(checkType == CheckTypeEnum.CHECK_OUT) {
      providedData.checkOutNumber = 1
    }
  }
    
    const newCheck = new Check(providedData);
    let savedCheck = await newCheck.save();
    if (savedCheck) {
      let operator = checkType == "Check_In" ? "+" : "-";
      await Customer.findOneAndUpdate(
        { _id: ObjectId(customer) },
        { $inc: { balance: operator + amount } },
        { new: true }
      );
    }
    let bellNumber =
      savedCheck.checkType == "Check_In"
        ? savedCheck.checkInNumber
        : savedCheck.checkOutNumber;
    let bellType = checkType;
    await addRoznamcha(bellNumber, bellType, date, amount, customer);
    return savedCheck;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteCheck = async (i18n, id) => {
  try {
    const { amount, customer, checkType, checkInNumber, checkOutNumber } =
      await Check.findById(id);
    const { balance } = await Customer.findById({ _id: customer });
    if (checkType == CheckTypeEnum.CHECK_OUT) {
      const updatedCustomer = await Customer.findOneAndUpdate(
        { _id: customer },
        { balance: balance + amount }
      );
      const isDeletedRoznamcha = await Roznamcha.findOneAndRemove({
        bellType: CheckTypeEnum.CHECK_OUT,
        bellNumber: checkOutNumber,
      });
      if (updatedCustomer) {
        const isDeletedCheck = await Check.findByIdAndRemove(id);
        return { message: i18n.__("check_deleted_successfully") };
      }
    }
    if (checkType == CheckTypeEnum.CHECK_IN) {
      const updatedCustomer = await Customer.findOneAndUpdate(
        { _id: customer },
        { balance: balance - amount }
      );
      const isDeletedRoznamcha = await Roznamcha.findOneAndRemove({
        bellType: CheckTypeEnum.CHECK_IN,
        bellNumber: checkInNumber,
      });

      if (updatedCustomer) {
        const isDeletedCheck = await Check.findByIdAndRemove(id);
        return { message: i18n.__("check_deleted_successfully") };
      }
    }

    return { message: i18n.__("failed_to_delete_customer") };
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
    const oldCheck =  await Check.findById(checkId)
    const {balance} =  await Customer.findById(customer)
  if(oldCheck.amount != amount){
    if (oldCheck.checkType == CheckTypeEnum.CHECK_OUT) {
      const updatedCustomer = await Customer.findOneAndUpdate(
        { _id: customer },
        { balance: balance + oldCheck.amount-amount }
      );
      const isUpdatedRoznamcha = await Roznamcha.findOneAndUpdate({
        bellType: CheckTypeEnum.CHECK_OUT,
        bellNumber: oldCheck.checkOutNumber,
      },
      {
        amount
      }
      );
    }
    if (checkType == CheckTypeEnum.CHECK_IN) {
      const updatedCustomer = await Customer.findOneAndUpdate(
        { _id: customer },
        { balance: balance - oldCheck.amount+amount }
      );
      const isUpdatedRoznamcha = await Roznamcha.findOneAndUpdate({
        bellType: CheckTypeEnum.CHECK_IN,
        bellNumber: oldCheck.checkInNumber,
      },
      {amount}
      );
    }
  }
  if(oldCheck.date != date) {
   if(checkType == CheckTypeEnum.CHECK_IN) {
    const isUpdatedRoznamcha = await Roznamcha.findOneAndUpdate({
      bellType: CheckTypeEnum.CHECK_IN,
      bellNumber: oldCheck.checkInNumber,
    },
    {date}
    );
   }
   if(checkType == CheckTypeEnum.CHECK_OUT) {
    const isUpdatedRoznamcha = await Roznamcha.findOneAndUpdate({
      bellType: CheckTypeEnum.CHECK_OUT,
      bellNumber: oldCheck.checkOutNumber,
    },
    {date}
    );
   }
  }

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
const reportChecks = async (
  checkType,
  startDate,
  endDate,
  startAmount,
  endAmount,
  customer
) => {
  const filters = [{}];
  checkType && filters.push({ checkType });
  customer && filters.push({ customer: ObjectId(customer) });

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
    let checks = await Check.aggregate(pipline);
    return checks;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getLastCheck = async (checkType) => {
  const pipline = [
    {$match:{checkType}},
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
  ];
  try {
    let checks = await Check.aggregate(pipline);
    return checks[0];
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getCheck = async (id) => {
  const pipline = [
    {$match:{_id:ObjectId(id)}},
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
    return checks[0];
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
  reportChecks,
  getLastCheck,
  getCheck
};
