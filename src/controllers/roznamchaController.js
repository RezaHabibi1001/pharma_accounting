const RoznamchaService = require("../services/roznamchaService");

module.exports = {
  async getRoznamcha(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { date } = args;
      return RoznamchaService.getRoznamcha(date);
    } catch (error) {
      throw error;
    }
  },
  async getRepository(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      return RoznamchaService.getRepository();
    } catch (error) {
      throw error;
    }
  },
  async getStatistic(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      return RoznamchaService.getStatistic();
    } catch (error) {
      throw error;
    }
  },
  async getBackup(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { dbName } = args;
      return RoznamchaService.getBackup(i18n,dbName);
    } catch (error) {
      throw error;
    }
  }
};
