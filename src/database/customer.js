const Customer = require("../models/customer");
const Factor = require("../models/factor");
const Check = require("../models/check");
const Sentry = require("../log");
const { BalanceStatus } = require("../utils/enum");
const { ObjectId } = require("mongoose").Types;

const getCustomers = async () => {
  try {
    const pipline = [
      {
        $sort: {
          fullName: 1
        }
      },
    ]
    return await Customer.aggregate(pipline);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addCustomer = async (
  i18n,
  fullName,
  phoneNumber,
  city,
  address,
  company,
  balance,
  category
) => {
  try {
    const newCustomer = new Customer({
      fullName,
      phoneNumber,
      city,
      address,
      company,
      balance,
      category
    });
    return await newCustomer.save();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteCustomer = async (i18n, id) => {
  try {
    const factorExistWithCustomer = await Factor.findOne({customer: ObjectId(id)});
    if (factorExistWithCustomer) {
      return { message: i18n.__("delete_factor_before_delete_customer") };
    }
    const checkExistWithCustomer = await Check.findOne({customer: ObjectId(id)});
    if (checkExistWithCustomer) {
      return { message: i18n.__("delete_check_before_delete_customer") };
    }
    
    const isDeletedCustomer = await Customer.findByIdAndRemove(id);
    if (isDeletedCustomer) {
      return { message: i18n.__("customer_deleted_successfully") };
    } else {
      return { message: i18n.__("failed_to_delete_customer") };
    }
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editCustomer = async (
  i18n,
  customerId,
  fullName,
  phoneNumber,
  city,
  address,
  company,
  balance,
  category
) => {
  let companyAlreadyExist = await Customer.findOne({
    company,
    _id: { $nin: customerId },
  });
  if (companyAlreadyExist) {
    throw new Error(i18n.__("customer_already_exist"));
  }
  try {
    return await Customer.findOneAndUpdate(
      { _id: customerId },
      {
        fullName,
        phoneNumber,
        city,
        address,
        company,
        balance,
        category
      },
      { new: true }
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const reportCustomers = async (
  fullName,
  balanceStatus,
  city,
  address,
  startBalance,
  endBalance,
  category
) => {
  const filters = [{}];
  fullName && filters.push({ fullName });
  city && filters.push({ city });
  address && filters.push({ address });
  category && filters.push({ category });

  if (balanceStatus) {
    if (balanceStatus == BalanceStatus.POSITIVE) {
      filters.push({ balance: { $gt: 0 } });
    } else if (balanceStatus == BalanceStatus.NEGATIVE) {
      filters.push({ balance: { $lt: 0 } });
    } else if (balanceStatus == BalanceStatus.ZERO) {
      filters.push({ balance: 0 });
    }
  }
  if (startBalance || endBalance) {
    if (startBalance && endBalance) {
      filters.push({
        balance: { $gte: startBalance, $lte: endBalance },
      });
    } else if (startBalance) {
      filters.push({ balance: { $gte: startBalance } });
    } else if (endBalance) {
      filters.push({ balance: { $lte: endBalance } });
    }
  }

  const pipline = [{ $match: { $and: filters } }];
  try {
    let customers = await Customer.aggregate(pipline);
    return customers;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getCustomerDetails = async (i18n, id) => {
  const pipeline = [
    {
      $match: { "customer": ObjectId(id) },
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
        createdAt: { $first: "$createdAt" },
      },
    },
  ];
  const pipeline2 = [
    {
      $match: { "customer": ObjectId(id) },
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
      $group: {
        _id: "$_id",
        checkInNumber: { $first: "$checkInNumber" },
        checkOutNumber: { $first: "$checkOutNumber" },
        checkType: { $first: "$checkType" },
        date: { $first: "$date" },
        amount: { $first: "$amount" },
        description: { $first: "$description" },
        customer: { $first: "$customer" },
        createdAt: { $first: "$createdAt" },

      },
    },
  ];

  try {
    const factors = await Factor.aggregate(pipeline);
    const checks = await Check.aggregate(pipeline2);
    let result  =  [...factors , ...checks] 
    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    for(let i=0 ; i < result.length; i++ ) {
      let currentBalance = 0
      for(let j=0; j <= i; j++){
        if(result[j]?.paymentType == "No_Cash") {
            if(result[j]?.factorType == "Buy"){
              currentBalance+=result[j].amount
            }
            if(result[j]?.factorType == "Sell") {
              currentBalance-=result[j].amount
            }
        }
        if(result[j]?.checkType == "Check_In") {
          currentBalance+=result[j].amount
        }
        if(result[j]?.checkType == "Check_Out"){
          currentBalance-=result[j].amount
        }
        if(i==j){
          result[j].customerBalance = currentBalance
        }
      }
    }
    return result
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getCustomers,
  addCustomer,
  deleteCustomer,
  editCustomer,
  reportCustomers,
  getCustomerDetails
};
