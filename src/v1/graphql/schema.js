const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar Upload
  scalar DateTime
  enum RoleEnum {
    Admin
    Standard
    Guest
  }
  type User {
    _id: ID
    firstName: String
    lastName: String
    userName: String
    password: String
    role: String
    createdAt: DateTime
  }
  type DrugType {
    _id: ID
    title: String
    createdAt: DateTime
  }
  type Stack {
    _id: ID
    name: String
    type: String
    address: String
    createdAt: DateTime
  }
  type Message {
    message: String
  }
  enum ReittanceEnum {
    Exchange
    Card_to_card
  }
  type Remittance {
    _id: ID
    number: String
    type: String
    amount: Int
    customerName: String
    shopAddress: String
    via: String
    description: String
    date: DateTime
    createdAt: DateTime
  }
  type Employee {
    _id: ID
    fullName: String
    phoneNumber: String
    job: String
    contractDate: String
    workTime: String
    salary: Int
    createdAt: DateTime
  }
  type Customer {
    _id: ID
    fullName: String
    phoneNumber: String
    city: String
    address: String
    company: String
    balance: Int
    createdAt: DateTime
  }
  type Drug {
    _id: ID
    name: String
    drugType: DrugType
    company: String
    country: String
    amount: Int
    price: Int
    stack: Stack
    expDate: String
    createdAt: DateTime
  }

  type Query {
    getUsers: [User]
    getDrugTypes: [DrugType]
    getStacks: [Stack]
    getRemittances: [Remittance]
    getEmployees: [Employee]
    getCustomers: [Customer]
    getDrugs: [Drug]
  }
  type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      userName: String!
      password: String!
      role: RoleEnum!
    ): User
    deleteUser(id: ID): Message
    editUser(
      userId: ID!
      firstName: String
      lastName: String
      userName: String
      password: String
      role: RoleEnum
    ): User
    addDrugType(title: String!): DrugType
    deleteDrugType(id: ID!): Message
    editDrugType(drugTypeId: ID!, title: String!): DrugType
    addStack(name: String!, type: String!, address: String!): Stack
    deleteStack(id: ID!): Message
    editStack(stackId: ID!, name: String, type: String, address: String): Stack
    addRemittance(
      number: String!
      type: ReittanceEnum!
      amount: Int!
      customerName: String!
      shopAddress: String!
      via: String!
      description: String!
      date: DateTime!
    ): Remittance
    editRemittance(
      remittanceId: ID!
      number: String
      type: ReittanceEnum
      amount: Int
      customerName: String
      shopAddress: String
      via: String
      description: String
      date: DateTime
    ): Remittance
    deleteRemittance(id: ID!): Message
    addEmployee(
      fullName: String
      phoneNumber: String
      job: String
      contractDate: String
      workTime: String
      salary: Int
    ): Employee
    editEmployee(
      employeeId: ID!
      fullName: String
      phoneNumber: String
      job: String
      contractDate: String
      workTime: String
      salary: Int
    ): Employee
    deleteEmployee(id: ID!): Message
    addCustomer(
      fullName: String
      phoneNumber: String
      city: String
      address: String
      company: String
      balance: Int
    ): Customer
    editCustomer(
      customerId: ID!
      fullName: String
      phoneNumber: String
      city: String
      address: String
      company: String
      balance: Int
    ): Customer
    deleteCustomer(id: ID!): Message
    addDrug(
      name: String!
      drugType: ID!
      company: String!
      country: String!
      amount: Int!
      price: Int!
      stack: ID!
      expDate: String!
    ): Drug
    editDrug(
      drugId: ID!
      name: String
      drugType: ID
      company: String
      country: String
      amount: Int
      price: Int
      stack: ID
      expDate: String
    ): Drug
    deleteDrug(id: ID!): Message
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
module.exports = {
  typeDefs,
};
