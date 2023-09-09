const Customer = require("../models/customer");
const Sentry = require("../../log");

const getCustomers = async () => {
  try {
    return await Customer.find();
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
  let customerAlreadyExist = await Customer.findOne({
    company,
  });
  if (customerAlreadyExist) {
    throw new Error(i18n.__("customer_already_exist"));
  }
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
module.exports = {
  getCustomers,
  addCustomer,
  deleteCustomer,
  editCustomer,
};
