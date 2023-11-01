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
  balance
) => {
  try {
    const newCustomer = new Customer({
      fullName,
      phoneNumber,
      city,
      address,
      company,
      balance,
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
  balance
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
  endBalance
) => {
  const filters = [{}];
  fullName && filters.push({ fullName });
  city && filters.push({ city });
  address && filters.push({ address });

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
module.exports = {
  getCustomers,
  addCustomer,
  deleteCustomer,
  editCustomer,
  reportCustomers,
};
