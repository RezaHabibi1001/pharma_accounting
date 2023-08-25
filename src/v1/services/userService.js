const User = require("../database/user");
const Sentry = require("../../log");
const getUsers = async () => {
  try {
    return await User.getUsers();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getUsers,
};
