const FactorService = require("../services/factorService");

module.exports = {
  async getFactors(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const {pageNumber ,perPage, searchItem ,factorType , paymentType} =  args

      return FactorService.getFactors(pageNumber ,perPage, searchItem ,factorType , paymentType);
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
        discount,
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
        discount,
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
  async getLastFactor(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { factorType } = args;
      return FactorService.getLastFactor(factorType);
    } catch (error) {
      throw error;
    }
  },
  async getFactor(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { id } = args;
      return FactorService.getFactor(id);
    } catch (error) {
      throw error;
    }
  },
  async getFactorByNumber(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { factorNumber,factorType } = args;
      return FactorService.getFactorByNumber(factorNumber , factorType);
    } catch (error) {
      throw error;
    }
  },
  async reportFactors(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const {
        factorNumber,
        factorType,
        paymentType,
        customer,
        drug,
        startDate,
        endDate,
        startAmount,
        endAmount,
      } = args;
      return FactorService.reportFactors(
        factorNumber,
        factorType,
        paymentType,
        customer,
        drug,
        startDate,
        endDate,
        startAmount,
        endAmount
      );
    } catch (error) {
      throw error;
    }
  },
};
