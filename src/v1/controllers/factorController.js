const FactorService = require("../services/factorService");

module.exports = {
  async getFactors(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;

      return FactorService.getFactors();
    } catch (error) {
      throw error;
    }
  },
  async addFactor(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const {
        factorType,
        paymentType,
        date,
        amount,
        description,
        customer,
        items,
      } = args;
      return FactorService.addFactor(
        i18n,
        factorType,
        paymentType,
        date,
        amount,
        description,
        customer,
        items
      );
    } catch (error) {
      throw error;
    }
  },
  async deleteFactor(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { id } = args;
      return FactorService.deleteFactor(i18n, id);
    } catch (error) {
      throw error;
    }
  },
  async editFactor(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n } = req;
      const {
        factorId,
        factorType,
        paymentType,
        date,
        amount,
        description,
        customer,
        items,
      } = args;
      return FactorService.editFactor(
        i18n,
        factorId,
        factorType,
        paymentType,
        date,
        amount,
        description,
        customer,
        items
      );
    } catch (error) {
      throw error;
    }
  },
};
