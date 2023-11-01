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
      const { firstName, lastName, userName, password, role } = args;
      return UserService.addUser(
        i18n,
        firstName,
        lastName,
        userName,
        password,
        role
      );
    } catch (error) {
      throw error;
    }
  },
  async deleteUser(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { id } = args;
      return UserService.deleteUser(i18n, id);
    } catch (error) {
      throw error;
    }
  },
  async editUser(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n } = req;
      const { userId, firstName, lastName, userName, password, role } = args;
      return UserService.editUser(
        i18n,
        userId,
        firstName,
        lastName,
        userName,
        password,
        role
      );
    } catch (error) {
      throw error;
    }
  },
  async login(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n } = req;
      const { userName, password } = args;
      return UserService.login(i18n, userName, password);
    } catch (error) {
      throw error;
    }
  },
};
