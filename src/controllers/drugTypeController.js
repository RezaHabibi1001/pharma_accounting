const DrugTypeService = require("../services/drugTypeService");

module.exports = {
  async getDrugTypes(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;

      return DrugTypeService.getDrugTypes();
    } catch (error) {
      throw error;
    }
  },
  async addDrugType(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { title } = args;
      return DrugTypeService.addDrugType(i18n, title);
    } catch (error) {
      throw error;
    }
  },
  async deleteDrugType(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { id } = args;
      return DrugTypeService.deleteDrugType(i18n, id);
    } catch (error) {
      throw error;
    }
  },
  async editDrugType(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n } = req;
      const { drugTypeId, title } = args;
      return DrugTypeService.editDrugType(i18n, drugTypeId, title);
    } catch (error) {
      throw error;
    }
  },
};
