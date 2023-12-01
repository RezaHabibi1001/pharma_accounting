const CheckService = require("../services/checkService");

module.exports = {
  async getChecks(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const {pageNumber ,perPage, searchItem ,checkType} =  args
      return CheckService.getChecks(pageNumber ,perPage, searchItem ,checkType);
    } catch (error) {
      throw error;
    }
  },
  async addCheck(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { checkType, date, amount, description, customer } = args;
      return CheckService.addCheck(
        i18n,
        checkType,
        date,
        amount,
        description,
        customer
      );
    } catch (error) {
      throw error;
    }
  },
  async deleteCheck(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { id } = args;
      return CheckService.deleteCheck(i18n, id);
    } catch (error) {
      throw error;
    }
  },
  async editCheck(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n } = req;
      const { checkId, checkType, date, amount, description, customer } = args;
      return CheckService.editCheck(
        i18n,
        checkId,
        checkType,
        date,
        amount,
        description,
        customer
      );
    } catch (error) {
      throw error;
    }
  },
  async reportChecks(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const {
        checkNumber,
        checkType,
        startDate,
        endDate,
        startAmount,
        endAmount,
        customer,
      } = args;
      return CheckService.reportChecks(
        checkNumber,
        checkType,
        startDate,
        endDate,
        startAmount,
        endAmount,
        customer
      );
    } catch (error) {
      throw error;
    }
  },
  async getLastCheck(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const {checkType} =  args
      return CheckService.getLastCheck(checkType);
    } catch (error) {
      throw error;
    }
  },
  async getCheck(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const {id} =  args
      return CheckService.getCheck(id);
    } catch (error) {
      throw error;
    }
  },
};
