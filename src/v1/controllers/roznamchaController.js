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
};
