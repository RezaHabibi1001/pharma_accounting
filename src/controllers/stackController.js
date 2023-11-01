const StackService = require("../services/stackService");

module.exports = {
  async getStacks(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;

      return StackService.getStacks();
    } catch (error) {
      throw error;
    }
  },
  async addStack(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { name, type, address } = args;
      return StackService.addStack(i18n, name, type, address);
    } catch (error) {
      throw error;
    }
  },
  async deleteStack(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { id } = args;
      return StackService.deleteStack(i18n, id);
    } catch (error) {
      throw error;
    }
  },
  async editStack(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n } = req;
      const { stackId, name, type, address } = args;
      return StackService.editStack(i18n, stackId, name, type, address);
    } catch (error) {
      throw error;
    }
  },
};
