const UserService = require("../services/userService");

module.exports = {
  async getUsers(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;

      return UserService.getUsers();
    } catch (error) {
      throw error;
    }
  },
  async addUser(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      return [];
      // return UserService.getUsers();
    } catch (error) {
      throw error;
    }
  },
};
