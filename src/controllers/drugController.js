const DrugService = require("../services/drugService");

module.exports = {
  async getDrugs(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;

      return DrugService.getDrugs();
    } catch (error) {
      throw error;
    }
  },
  async getDrugDetails(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { id } =  args

      return DrugService.getDrugDetails(i18n,id);
    } catch (error) {
      throw error;
    }
  },
  async addDrug(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const {
        name,
        drugType,
        company,
        country,
        amount,
        price,
        stack,
        expDate,
      } = args;
      return DrugService.addDrug(
        i18n,
        name,
        drugType,
        company,
        country,
        amount,
        price,
        stack,
        expDate
      );
    } catch (error) {
      throw error;
    }
  },
  async deleteDrug(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { id } = args;
      return DrugService.deleteDrug(i18n, id);
    } catch (error) {
      throw error;
    }
  },
  async editDrug(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n } = req;
      const {
        drugId,
        name,
        drugType,
        company,
        country,
        amount,
        price,
        stack,
        expDate,
      } = args;
      return DrugService.editDrug(
        i18n,
        drugId,
        name,
        drugType,
        company,
        country,
        amount,
        price,
        stack,
        expDate
      );
    } catch (error) {
      throw error;
    }
  },
  async reportDrugs(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const {
        drugType,
        drugName,
        drugCompany,
        drugCountry,
        drugStack,
        startAmount,
        endAmount,
        startPrice,
        endPrice,
        startDate,
        endDate,
      } = args;
      return DrugService.reportDrugs(
        drugType,
        drugName,
        drugCompany,
        drugCountry,
        drugStack,
        startAmount,
        endAmount,
        startPrice,
        endPrice,
        startDate,
        endDate
      );
    } catch (error) {
      throw error;
    }
  },
};
