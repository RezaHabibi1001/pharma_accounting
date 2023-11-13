const ConsumeService = require("../services/consumeService");

module.exports = {
  async getConsumes(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      return ConsumeService.getConsumes();
    } catch (error) {
      throw error;
    }
  },
  async addConsume(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n } = req;
      const { name , amount , date ,description ,  userId} = args;
      return ConsumeService.addConsume(
        i18n,
        name,
        amount,
        date,
        description,
        userId
      );
    } catch (error) {
      throw error;
    }
  },
  async deleteConsume(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { id } = args;
      return ConsumeService.deleteConsume(i18n, id);
    } catch (error) {
      throw error;
    }
  },
};
