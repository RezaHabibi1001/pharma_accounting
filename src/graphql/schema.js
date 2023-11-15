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
  enum CheckTypeEnum {
    Check_In
    Check_Out
  }
  enum FactorTypeEnum {
    Buy
    Sell
  }
  enum PaymentTypeEnum {
    Cash
    No_Cash
  }
  enum BalanceStatusEnum {
    Positive
    Negative
    Zero
  }
  type Remittance {
    _id: ID
    number: String
    type: String
    amount: Float
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
    balance:Int
    createdAt: DateTime
  }
  type Customer {
    _id: ID
    fullName: String
    phoneNumber: String
    category:String
    city: String
    address: String
    company: String
    balance: Float
    createdAt: DateTime
  }
  type Drug {
    _id: ID
    name: String
    drugType: DrugType
    company: String
    country: String
    amount: Float
    price: Float
    stack: Stack
    expDate: String
    createdAt: DateTime
  }
  type Check {
    _id: ID
    checkInNumber: Int
    checkOutNumber: Int
    checkType: String
    date: String
    amount: Float
    description: String
    customer: Customer
    createdAt:DateTime
  }

  input FactorItemInput {
    drug: ID!
    quantity: Int!
    price: Float!
    total: Float!
    description: String
  }
  type FactorItem {
    buyFactorNumber: Int
    sellFactorNumber: Int
    drug: Drug
    quantity: Int
    price: Float
    total: Float
    description: String
  }
  type Factor {
    _id: ID
    buyFactorNumber: Int
    sellFactorNumber: Int
    factorType: FactorTypeEnum
    paymentType: PaymentTypeEnum
    date: String
    amount: Float
    discount:Float
    description: String
    customer: Customer
    createdAt:DateTime
  }
  type LastFactor {
    _id: ID
    buyFactorNumber: Int
    sellFactorNumber: Int
    factorType: FactorTypeEnum
    paymentType: PaymentTypeEnum
    date: String
    amount: Float
    discount:Float
    description: String
    customer: Customer
    items: [FactorItem]
  }
  type Roznamcha {
    _id: ID
    bellNumber: Int
    bellType: String
    date: String!
    amount: Float!
    customer: Customer
    employee: Employee
    user: User
    createdAt: DateTime
  }
  type Statistic {
    userCount:Int,
    stackCount:Int,
    drugCount:Int,
    customerCount:Int,
    checkCount:Int,
    factorCount:Int
  }
  type Salary {
    _id:ID
    employeeId:Employee
    salaryNumber:Int
    amount:Int
    date:DateTime
    description:String
  }
  type Consume {
    _id:ID
    userId:User
    name:String
    consumeNumber:Int
    amount:Int
    date:DateTime
    description:String
  }
  type Query {
    getUsers: [User]
    getDrugTypes: [DrugType]
    getStacks: [Stack]
    getRemittances: [Remittance]
    getEmployees: [Employee]
    getCustomers: [Customer]
    getDrugs: [Drug]
    getChecks: [Check]
    getFactors: [Factor]
    getRoznamcha(date: DateTime): [Roznamcha]
    getLastFactor(factorType: FactorTypeEnum!): LastFactor
    getFactor(id:ID!): LastFactor
    getFactorByNumber(factorNumber:Int! , factorType:FactorTypeEnum!):LastFactor
    getLastCheck(checkType:CheckTypeEnum!):Check
    reportDrugs(
      drugType: ID
      drugName: String
      drugCompany: String
      drugCountry: String
      drugStack: String
      startAmount: Float
      endAmount: Float
      startPrice: Float
      endPrice: Float
      startDate: DateTime
      endDate: DateTime
    ): [Drug]
    reportCustomers(
      fullName: String
      balanceStatus: BalanceStatusEnum
      city: String
      address: String
      startBalance: Float
      endBalance: Float
      category:String
    ): [Customer]
    reportChecks(
      checkNumber:Int
      checkType: CheckTypeEnum
      startDate: DateTime
      endDate: DateTime
      startAmount: Float
      endAmount: Float
      customer: ID
    ): [Check]
    reportFactors(
      factorNumber:Int
      factorType: FactorTypeEnum
      paymentType: PaymentTypeEnum
      customer: ID
      drug: ID
      startDate: DateTime
      endDate: DateTime
      startAmount: Float
      endAmount: Float
    ): [Factor]
    getRepository:Int
    getStatistic:Statistic
    getCheck(id:ID!):Check
    getDrugDetails(id:ID):[LastFactor]
    getSalaries(employeeId:ID!):[Salary]
    getConsumes:[Consume]
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
      amount: Float!
      customerName: String!
      shopAddress: String!
      via: String!
      description: String
      date: DateTime!
    ): Remittance
    editRemittance(
      remittanceId: ID!
      number: String
      type: ReittanceEnum
      amount: Float
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
      balance: Float
      category:String!
    ): Customer
    editCustomer(
      customerId: ID!
      fullName: String
      phoneNumber: String
      city: String
      address: String
      company: String
      balance: Float
      category:String
    ): Customer
    deleteCustomer(id: ID!): Message
    addDrug(
      name: String!
      drugType: ID!
      company: String!
      country: String!
      amount: Float!
      price: Float!
      stack: ID!
      expDate: String!
    ): Drug
    editDrug(
      drugId: ID!
      name: String
      drugType: ID
      company: String
      country: String
      amount: Float
      price: Float
      stack: ID
      expDate: String
    ): Drug
    deleteDrug(id: ID!): Message
    addCheck(
      checkType: CheckTypeEnum!
      date: String!
      amount: Float!
      description: String
      customer: ID!
    ): Check
    editCheck(
      checkId: ID!
      checkType: CheckTypeEnum!
      date: String!
      amount: Float!
      description: String
      customer: ID!
    ): Check
    deleteCheck(id: ID!): Message
    addFactor(
      factorType: FactorTypeEnum!
      paymentType: PaymentTypeEnum!
      date: String!
      amount: Float!
      discount:Float!
      description: String
      customer: ID!
      items: [FactorItemInput]
    ): Factor
    editFactor(
      factorId: ID
      paymentType: PaymentTypeEnum
      date: String
      description: String
      customer: ID
      items: [FactorItemInput]
    ): Factor
    deleteFactor(id: ID!): Message
    login(userName: String, password: String): User
    getBackup:Message
    addSalary(employeeId:ID! , date:DateTime , amount:Int! , description:String):Salary
    deleteSalary(id:ID):Message
    addConsume(name:String , date:DateTime , amount:Int! , description:String , userId:ID!):Consume
    deleteConsume(id:ID):Message
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
module.exports = {
  typeDefs,
};
