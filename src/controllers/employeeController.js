const EmployeeService = require("../services/employeeService");

module.exports = {
  async getEmployees(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;

      return EmployeeService.getEmployees();
    } catch (error) {
      throw error;
    }
  },
  async addEmployee(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { fullName, phoneNumber, job, contractDate, workTime, salary } =
        args;
      return EmployeeService.addEmployee(
        i18n,
        fullName,
        phoneNumber,
        job,
        contractDate,
        workTime,
        salary
      );
    } catch (error) {
      throw error;
    }
  },
  async deleteEmployee(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n, userId } = req;
      const { id } = args;
      return EmployeeService.deleteEmployee(i18n, id);
    } catch (error) {
      throw error;
    }
  },
  async editEmployee(parent, args, context, info) {
    try {
      const { req } = context;
      const { i18n } = req;
      const {
        employeeId,
        fullName,
        phoneNumber,
        job,
        contractDate,
        workTime,
        salary,
      } = args;
      return EmployeeService.editEmployee(
        i18n,
        employeeId,
        fullName,
        phoneNumber,
        job,
        contractDate,
        workTime,
        salary
      );
    } catch (error) {
      throw error;
    }
  },
};
