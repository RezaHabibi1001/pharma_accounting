const Profile = require("../database/profile");
const Sentry = require("../log");
const Joi = require("joi");

const getProfile = async () => {
  try {
    return await Profile.getProfile();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addProfile = async (i18n, titleOne, titleTwo, owners, phones, address) => {
  const data = { titleOne, titleTwo, owners, phones, address };
  const schema = Joi.object({
    titleOne: Joi.string().required(),
    titleTwo: Joi.string().required(),
    owners: Joi.array().required(),
    phones: Joi.array().required(),
    address:Joi.string().required()
  });
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    return await Profile.addProfile(
      i18n,
      titleOne, 
      titleTwo, 
      owners, 
      phones, 
      address
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editProfile = async (
  i18n,
  titleOne, 
  titleTwo, 
  owners, 
  phones, 
  address
) => {
  const data = { titleOne, titleTwo, owners, phones, address };

  try {
    return await Profile.editProfile(
      i18n,
      titleOne, 
      titleTwo, 
      owners, 
      phones, 
      address
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

module.exports = {
  getProfile,
  addProfile,
  editProfile
};
