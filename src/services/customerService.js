const Customer = require("../database/customer");
const Sentry = require("../log");
const Joi = require("joi");

const getCustomers = async () => {
  try {
    return await Customer.getCustomers();
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
  const data = { fullName, phoneNumber, city, address, company, balance ,  category };
  const schema = Joi.object({
    fullName: Joi.string().required(),
    phoneNumber: Joi.string(),
    city: Joi.string().required(),
    address: Joi.string(),
    company: Joi.string(),
    balance: Joi.number().required(),
    category:Joi.string()
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Customer.addCustomer(
      i18n,
      fullName,
      phoneNumber,
      city,
      address,
      company,
      balance,
      category
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteCustomer = async (i18n, id) => {
  const data = { id };
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Customer.deleteCustomer(i18n, id);
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
  const data = {
    customerId,
    fullName,
    phoneNumber,
    city,
    address,
    company,
    balance,
    category
  };
  const schema = Joi.object({
    customerId: Joi.string().required(),
    fullName: Joi.string(),
    phoneNumber: Joi.string(),
    city: Joi.string(),
    address: Joi.string(),
    company: Joi.string(),
    balance: Joi.number(),
    category:Joi.string()
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Customer.editCustomer(
      i18n,
      customerId,
      fullName,
      phoneNumber,
      city,
      address,
      company,
      balance,
      category
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
  try {
    return await Customer.reportCustomers(
      fullName,
      balanceStatus,
      city,
      address,
      startBalance,
      endBalance,
      category
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getCustomerDetails = async (i18n,id) => {
  try {
    return await Customer.getCustomerDetails(i18n,id);
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
