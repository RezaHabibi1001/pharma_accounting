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
  getCustomerDetails
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
  getConsumes,
  addConsume,
  deleteConsume
} = require("../controllers/consumeController");
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
const { getRoznamcha  , getRepository ,  getStatistic  ,getBackup ,  selectDatabase} = require("../controllers/roznamchaController");
const { getPeriods,addPeriod,deletePeriod,editPeriod} = require("../controllers/periodController");
const { getProfile,addProfile,editProfile} = require("../controllers/profileController");

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
    deleteSalary,
    addConsume,
    deleteConsume,
    selectDatabase,
    addPeriod,
    deletePeriod,
    editPeriod,
    addProfile,
    editProfile

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
    getSalaries,
    getConsumes,
    getCustomerDetails,
    getPeriods,
    getProfile
  },
};

module.exports = {
  resolvers,
};
