const RoznamchaService = require("../services/roznamchaService");

module.exports = {
  async getRoznamcha(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;

      return RoznamchaService.getRoznamcha();
    } catch (error) {
      throw error;
    }
  },
};
