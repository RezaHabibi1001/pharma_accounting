const PeriodService = require("../services/periodService");

module.exports = {
  async getPeriods(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;

      return PeriodService.getPeriods();
    } catch (error) {
      throw error;
    }
  },
  async addPeriod(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { name } = args;
      return PeriodService.addPeriod(i18n, name);
    } catch (error) {
      throw error;
    }
  },
  async deletePeriod(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { id } = args;
      return PeriodService.deletePeriod(i18n, id);
    } catch (error) {
      throw error;
    }
  },
  async editPeriod(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n } = req;
      const { periodId, name, isClosed } = args;
      return PeriodService.editPeriod(i18n, periodId, name, isClosed);
    } catch (error) {
      throw error;
    }
  },
};
