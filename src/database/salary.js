const Salary = require("../models/salary");
const Employee = require("../models/employee");
const Roznamcha = require("../models/roznamcha");
const Sentry = require("../log");
const { addRoznamcha } = require("./roznamcha");
const { ObjectId } = require("mongoose").Types;
const getSalaries = async (employeeId) => {
  const pipline = [
    {
      $match:{
        employeeId:ObjectId(employeeId)
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $lookup: {
        from: "employees",
        localField: "employeeId",
        foreignField: "_id",
        as: "employeeId",
      },
    },
    {
      $unwind: {
        path: "$employeeId",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  try {
    let salaries = await Salary.aggregate(pipline);
    return salaries;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addSalary = async (
  i18n,
  employeeId,
  amount,
  date,
  description
) => {
  try {
    let providedData = {
      employeeId,
      amount,
      date,
      description
    }
    const lastSalary  =  await Salary.find({}).sort({createdAt:-1}).limit(1)
    if(lastSalary[0]) {
      providedData.salaryNumber = lastSalary[0].salaryNumber+1
    }else {
      providedData.salaryNumber = 1
    }
    const newSalary = new Salary(providedData);
    let savedSalary = await newSalary.save();
    if (savedSalary) {
      await Employee.findOneAndUpdate(
        { _id: ObjectId(employeeId) },
        { $inc: { balance:-amount } },
        { new: true }
      );
    }
    await addRoznamcha(providedData.salaryNumber, "salary", date, amount, employeeId);
    return savedSalary;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteSalary = async (i18n, id) => {
  try {
    const { amount, employeeId, date ,  salaryNumber } = await Salary.findById(id);
    const { balance } = await Employee.findById({ _id: employeeId });

      const updatedEmployee = await Employee.findOneAndUpdate(
        { _id: employeeId },
        { balance: balance + amount }
      );
      const isDeletedRoznamcha = await Roznamcha.findOneAndRemove({
        bellType:"salary",
        bellNumber: salaryNumber,
      });
      if (isDeletedRoznamcha) {
        const isDeletedSalary = await Salary.findByIdAndRemove(id);
        return { message: i18n.__("salary_deleted_successfully") };
      }
    return { message: i18n.__("failed_to_delete_salary") };
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

module.exports = {
getSalaries,
addSalary,
deleteSalary
};
