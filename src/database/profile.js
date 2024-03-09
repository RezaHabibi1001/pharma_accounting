const Profile = require("../models/profile");
const Sentry = require("../log");

const getProfile = async () => {
  try {
    let profiles = await Profile.find({})
    return profiles[0]
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addProfile = async (i18n, titleOne, titleTwo, owners, phones, address) => {
  let profileAlreadyExists = await Profile.find({})
  if (profileAlreadyExists.length) {
    throw new Error(i18n.__("profile_already_exist"));
  }
  try {
    const newProfile = new Profile({
      titleOne, 
      titleTwo, 
      owners, 
      phones, 
      address
    });
    return await newProfile.save();
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

  try {
    return await Profile.findOneAndUpdate(
      { },
      {
        titleOne, 
        titleTwo, 
        owners, 
        phones, 
        address
      },
      { new: true }
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
