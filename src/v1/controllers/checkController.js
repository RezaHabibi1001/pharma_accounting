const CheckService = require("../services/checkService");

module.exports = {
  async getChecks(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;

      return CheckService.getChecks();
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
};
