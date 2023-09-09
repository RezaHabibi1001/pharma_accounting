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
  },
  Query: {
    getUsers,
    getDrugTypes,
    getStacks,
    getRemittances,
    getEmployees,
    getCustomers,
    getDrugs,
  },
};

module.exports = {
  resolvers,
};
