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
};
