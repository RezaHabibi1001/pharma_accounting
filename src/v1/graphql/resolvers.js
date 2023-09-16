const {
  getUsers,
  addUser,
  deleteUser,
  editUser,
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
} = require("../controllers/customerController");
const {
  getDrugs,
  addDrug,
  deleteDrug,
  editDrug,
} = require("../controllers/drugController");
const {
  getChecks,
  addCheck,
  deleteCheck,
  editCheck,
} = require("../controllers/checkController");
const {
  getFactors,
  addFactor,
  deleteFactor,
  editFactor,
} = require("../controllers/factorController");
const { getRoznamcha } = require("../controllers/roznamchaController");

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
    deleteFactor,
    editFactor,
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
    getFactors,
    getRoznamcha,
  },
};

module.exports = {
  resolvers,
};
