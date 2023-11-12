const SalaryService = require("../services/salaryService");

module.exports = {
  async getSalaries(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const {employeeId} =  args
      return SalaryService.getSalaries(employeeId);
    } catch (error) {
      throw error;
    }
  },
  async addSalary(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { employeeId , amount , date ,description} = args;
      return SalaryService.addSalary(
        i18n,
        employeeId,
        amount,
        date,
        description
      );
    } catch (error) {
      throw error;
    }
  },
  async deleteSalary(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { id } = args;
      return SalaryService.deleteSalary(i18n, id);
    } catch (error) {
      throw error;
    }
  },
};
