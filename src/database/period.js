const Sentry = require("../log");
const { ObjectId } = require("mongoose").Types;
const { MongoClient } = require('mongodb');
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const Roznamcha = require("../models/roznamcha");
const Factor = require("../models/factor");
const Salary = require("../models/salary");
const Check = require("../models/check");
const Customer = require("../models/customer");
const Consume = require("../models/consume");
const Drug = require("../models/drug");
const Stack = require("../models/stack");
const User = require("../models/user");
const Period =  require("../models/period")
const Remittance  = require("../models/remittance")
const DrugType =  require("../models/drugType")
const Employee = require("../models/employee")
const getPeriods = async () => {
  try {
    const pipline = [{$sort:{ createdAt:-1}}]
    return await Period.aggregate(pipline);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addPeriod = async (i18n, name) => {

  let periodAlreadyExist = await Period.findOne({
    name,
  });
  if (periodAlreadyExist) {
    throw new Error(i18n.__("period_already_exist"));
  }
  try {
    const newPeriod = new Period({name});
    const result  =  await newPeriod.save();
  // find all records from current database
  const checks  =  await Check.find({})
  const consumes  =  await Consume.find({})
  const customers  =  await Customer.find({})
  const drugs  =  await Drug.find({})
  const drugTypes  =  await DrugType.find({})
  const employees  =  await Employee.find({})
  const factors  =  await Factor.find({})
  const pariods  =  await Period.find({})
  const remittances  =  await Remittance.find({})
  const roznamchas  =  await Roznamcha.find({})
  const salaries  =  await Salary.find({})
  const stacks  =  await Stack.find({})
  const users  =  await User.find({})
// switch to new database
await mongoose.connection.close();
mongoose.set("strictQuery", true);
mongoose.connect(`mongodb://localhost:27017/${name}`, { family: 4 }, async (err) =>  {
  if (err) {
    console.log("failed connection");
    Sentry.captureException(err);
  } else {
      console.log(`Connected To ${name} Database`);

      // insert all current data in new database
      // await Check.insertMany(checks)
      // await Consume.insertMany(consumes)
      await Customer.insertMany(customers)
      await Drug.insertMany(drugs)
      await DrugType.insertMany(drugTypes)
      await Employee.insertMany(employees)
      // await Factor.insertMany(factors)
      await Period.insertMany(pariods)
      // await Remittance.insertMany(remittances)
      // await Roznamcha.insertMany(roznamchas)
      // await Salary.insertMany(salaries)
      await Stack.insertMany(stacks)
      await User.insertMany(users)
    
  }
})
    return result
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deletePeriod = async (i18n, id) => {
  try {

    const isPeriodDeleted = await Period.findByIdAndRemove(id);
    if (isPeriodDeleted) {
      return { message: i18n.__("period_deleted_successfully") };
    } else {
      return { message: i18n.__("failed_to_delete_period") };
    }
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editPeriod = async (i18n, periodId, name, isClosed) => {
  let periodAlreadyExist = await Period.findOne({
    name,
    _id: { $nin: periodId },
  });
  if (periodAlreadyExist) {
    throw new Error(i18n.__("period_already_exist"));
  }
  try {
    return await Period.findOneAndUpdate(
      { _id: periodId },
      {
        name,
        isClosed
      },
      { new: true }
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getPeriods,
  addPeriod,
  deletePeriod,
  editPeriod,
};
