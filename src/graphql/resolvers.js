const {
  getUsers,
  addUser,
  deleteUser,
  editUser,
  login,
} = require("../controllers/userController");
const {
  getDrugTypes,
  addDrugType,
  deleteDrugType,
  editDrugType,
} = require("../controllers/drugTypeController");
const {
  getStacks,
  addStack,
  deleteStack,
  editStack,
} = require("../controllers/stackController");
const {
  getRemittances,
  addRemittance,
  deleteRemittance,
  editRemittance,
} = require("../controllers/remittanceController");
const {
  getEmployees,
  addEmployee,
  deleteEmployee,
  editEmployee,
} = require("../controllers/employeeController");
const {
  getCustomers,
  addCustomer,
  deleteCustomer,
  editCustomer,
  reportCustomers,
} = require("../controllers/customerController");
const {
  getDrugs,
  addDrug,
  deleteDrug,
  editDrug,
  reportDrugs,
  getDrugDetails
} = require("../controllers/drugController");
const {
  getChecks,
  getCheck,
  addCheck,
  deleteCheck,
  editCheck,
  reportChecks,
  getLastCheck
} = require("../controllers/checkController");
const {
  getSalaries,
  addSalary,
  deleteSalary
} = require("../controllers/salaryController");
const {
  getFactors,
  addFactor,
  deleteFactor,
  editFactor,
  getLastFactor,
  reportFactors,
  getFactor,
  getFactorByNumber
} = require("../controllers/factorController");
const { getRoznamcha  , getRepository ,  getStatistic  ,getBackup} = require("../controllers/roznamchaController");

const resolvers = {
  Mutation: {
    addUser,
    deleteUser,
    editUser,
    addDrugType,
    deleteDrugType,
    editDrugType,
    addStack,
    deleteStack,
    editStack,
    addRemittance,
    deleteRemittance,
    editRemittance,
    addEmployee,
    deleteEmployee,
    editEmployee,
    addCustomer,
    deleteCustomer,
    editCustomer,
    addDrug,
    deleteDrug,
    editDrug,
    addCheck,
    deleteCheck,
    editCheck,
    addFactor,
    editFactor,
    deleteFactor,
    login,
    getBackup,
    addSalary,
    deleteSalary
  },
  Query: {
    getUsers,
    getDrugTypes,
    getStacks,
    getRemittances,
    getEmployees,
    getCustomers,
    getDrugs,
    getChecks,
    getCheck,
    getFactors,
    getFactor,
    getRoznamcha,
    getLastFactor,
    reportDrugs,
    reportCustomers,
    reportChecks,
    reportFactors,
    getRepository,
    getLastCheck,
    getStatistic,
    getFactorByNumber,
    getDrugDetails,
    getSalaries
  },
};

module.exports = {
  resolvers,
};
