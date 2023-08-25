const User = require("../models/user");
const getUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getUsers,
};
