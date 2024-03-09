const ProfileService = require("../services/profileService");

module.exports = {
  async getProfile(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;

      return ProfileService.getProfile();
    } catch (error) {
      throw error;
    }
  },
  async addProfile(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { titleOne, titleTwo, owners, phones, address } = args;
      return ProfileService.addProfile(
        i18n,
        titleOne, 
        titleTwo, 
        owners, 
        phones, 
        address
      );
    } catch (error) {
      throw error;
    }
  },
  async editProfile(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n } = req;
      const {  titleOne, titleTwo, owners, phones, address} = args;
      return ProfileService.editProfile(
        i18n,
        titleOne, 
        titleTwo, 
        owners, 
        phones, 
        address
      );
    } catch (error) {
      throw error;
    }
  }
};
