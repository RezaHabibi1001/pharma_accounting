const User = require("../models/user");
const Sentry = require("../../log");

const getUsers = async () => {
  try {
    const pipline = [
      {
        $sort:{
          createdAt:-1
        }
      }
    ]
    return await User.aggregate(pipline);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addUser = async (i18n, firstName, lastName, userName, password, role) => {
  let userNameAlreadyExist = await User.findOne({
    userName,
  });
  if (userNameAlreadyExist) {
    throw new Error(i18n.__("userName_already_exist"));
  }
  try {
    const newUser = new User({
      firstName,
      lastName,
      userName,
      password,
      role,
    });
    return await newUser.save();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteUser = async (i18n, id) => {
  try {
    const isDeletedUser = await User.findByIdAndRemove(id);
    if (isDeletedUser) {
      return { message: i18n.__("user_deleted_successfully") };
    } else {
      return { message: i18n.__("failed_to_delete_user") };
    }
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editUser = async (
  i18n,
  userId,
  firstName,
  lastName,
  userName,
  password,
  role
) => {
  let userNameAlreadyExist = await User.findOne({
    userName,
    _id: { $nin: userId },
  });
  if (userNameAlreadyExist) {
    throw new Error(i18n.__("userName_already_exist"));
  }
  try {
    return await User.findOneAndUpdate(
      { _id: userId },
      {
        firstName,
        lastName,
        userName,
        password,
        role,
      },
      { new: true }
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const login = async (i18n, userName, password) => {
  try {
    let user = await User.findOne({ userName, password });
    if (!user) {
      throw new Error(i18n.__("userName_password_wrong"));
    }
    return user;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getUsers,
  addUser,
  deleteUser,
  editUser,
  login,
};
