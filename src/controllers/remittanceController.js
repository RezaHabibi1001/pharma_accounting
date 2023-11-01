const RemittanceService = require("../services/remittanceService");

module.exports = {
  async getRemittances(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;

      return RemittanceService.getRemittances();
    } catch (error) {
      throw error;
    }
  },
  async addRemittance(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const {
        number,
        type,
        amount,
        customerName,
        shopAddress,
        via,
        description,
        date,
      } = args;
      return RemittanceService.addRemittance(
        i18n,
        number,
        type,
        amount,
        customerName,
        shopAddress,
        via,
        description,
        date
      );
    } catch (error) {
      throw error;
    }
  },
  async deleteRemittance(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { id } = args;
      return RemittanceService.deleteRemittance(i18n, id);
    } catch (error) {
      throw error;
    }
  },
  async editRemittance(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n } = req;
      const {
        remittanceId,
        number,
        type,
        amount,
        customerName,
        shopAddress,
        via,
        description,
        date,
      } = args;
      return RemittanceService.editRemittance(
        i18n,
        remittanceId,
        number,
        type,
        amount,
        customerName,
        shopAddress,
        via,
        description,
        date
      );
    } catch (error) {
      throw error;
    }
  },
};
