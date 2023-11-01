const User = require("../database/user");
const Sentry = require("../log");
const { RoleEnum } = require("../utils/enum");
const Joi = require("joi");

const getUsers = async () => {
  try {
    return await User.getUsers();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addUser = async (i18n, firstName, lastName, userName, password, role) => {
  const data = { firstName, lastName, userName, password, role };
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userName: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.valid(RoleEnum.ADMIN, RoleEnum.STANDARD, RoleEnum.GUEST),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await User.addUser(
      i18n,
      firstName,
      lastName,
      userName,
      password,
      role
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteUser = async (i18n, id) => {
  const data = { id };
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await User.deleteUser(i18n, id);
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
  const data = { userId, firstName, lastName, userName, password, role };
  const schema = Joi.object({
    userId: Joi.string().required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    userName: Joi.string(),
    password: Joi.string(),
    role: Joi.valid(RoleEnum.ADMIN, RoleEnum.STANDARD, RoleEnum.GUEST),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await User.editUser(
      i18n,
      userId,
      firstName,
      lastName,
      userName,
      password,
      role
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const login = async (i18n, userName, password) => {
  const data = { userName, password };
  const schema = Joi.object({
    userName: Joi.string(),
    password: Joi.string(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await User.login(i18n, userName, password);
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
