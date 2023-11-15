const CustomerService = require("../services/customerService");

module.exports = {
  async getCustomers(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;

      return CustomerService.getCustomers();
    } catch (error) {
      throw error;
    }
  },
  async addCustomer(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { fullName, phoneNumber, city, address, company, balance, category } = args;
      return CustomerService.addCustomer(
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
      throw error;
    }
  },
  async deleteCustomer(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { id } = args;
      return CustomerService.deleteCustomer(i18n, id);
    } catch (error) {
      throw error;
    }
  },
  async editCustomer(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n } = req;
      const {
        customerId,
        fullName,
        phoneNumber,
        city,
        address,
        company,
        balance,
        category
      } = args;
      return CustomerService.editCustomer(
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
      throw error;
    }
  },
  async reportCustomers(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const {
        fullName,
        balanceStatus,
        city,
        address,
        startBalance,
        endBalance,
        category
      } = args;
      return CustomerService.reportCustomers(
        fullName,
        balanceStatus,
        city,
        address,
        startBalance,
        endBalance,
        category
      );
    } catch (error) {
      throw error;
    }
  },
};
