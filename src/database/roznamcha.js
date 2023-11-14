const Roznamcha = require("../models/roznamcha");
const Factor = require("../models/factor");
const Salary = require("../models/salary");
const Check = require("../models/check");
const Customer = require("../models/customer");
const Consume = require("../models/consume");
const Drug = require("../models/drug");
const Stack = require("../models/stack");
const User = require("../models/user");
const { exec } = require('child_process');
const Sentry = require("../log");

const addRoznamcha = async (bellNumber, bellType, date, amount, refrenceId) => {
  let providedDate = {
    bellNumber,
    bellType,
    date,
    amount,
  }
  if (bellType == "salary") {providedDate.employee = refrenceId}
  else if(bellType == "consume") {providedDate.user = refrenceId}
  else { providedDate.customer = refrenceId}
  
  const newRoznamcha = new Roznamcha(providedDate);
  let savedRoznamcha = await newRoznamcha.save();
  return savedRoznamcha;
};
const getRoznamcha = async date => {
  const pipline = [
    {
      $match: {
        date,
      },
    },
    {
      $sort:{
        createdAt:-1
      }
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "employee",
        foreignField: "_id",
        as: "employee",
      },
    },
    {
      $unwind: {
        path: "$employee",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  try {
    let roznamchas = await Roznamcha.aggregate(pipline);
    return roznamchas;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getRepository = async date => {

  let factorsDifference;
  let checkDifference;
  let totalSalaries;
  let totalConsumes;

  try {
    const factors =  await Factor.aggregate([
      {
        $match:{paymentType:"Cash"}
      },
      {
        $group: {
          _id: null,
          sellAmount: {
            $sum: {
              $cond: [
                { $eq: ["$factorType", "Sell"] },
                "$amount",
                0
              ]
            }
          },
          buyAmount: {
            $sum: {
              $cond: [
                { $eq: ["$factorType", "Buy"] },
                "$amount",
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalFactors: { $subtract: ["$sellAmount", "$buyAmount"] }
        }
      }
    ])
    const checks =  await Check.aggregate([
      {
        $group: {
          _id: null,
          checkInAmount: {
            $sum: {
              $cond: [
                { $eq: ["$checkType", "Check_In"] },
                "$amount",
                0
              ]
            }
          },
          checkOutAmount: {
            $sum: {
              $cond: [
                { $eq: ["$checkType", "Check_Out"] },
                "$amount",
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalCheck: { $subtract: ["$checkInAmount", "$checkOutAmount"] }
        }
      }
    ])
    const salaries =  await Salary.aggregate([
      {
        $group: {
          _id: null,
          totalSalary: { $sum: "$amount" }
        }
      }
    ])
    const consumes =  await Consume.aggregate([
      {
        $group: {
          _id: null,
          totalConsume: { $sum: "$amount" }
        }
      }
    ])

    if(factors.length == 0) {
      factorsDifference = 0
    }else {
      factorsDifference = factors[0].totalFactors
    }
    if(checks.length == 0) {
      checkDifference = 0
    }else {
      checkDifference = checks[0].totalCheck
    }
    if(salaries.length == 0) {
      totalSalaries = 0
    }else {
      totalSalaries = salaries[0].totalSalary
    }
    if(consumes.length == 0) {
      totalConsumes = 0
    }else {
      totalConsumes = consumes[0].totalConsume
    }
    return factorsDifference+checkDifference-totalSalaries-totalConsumes
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getStatistic = async date => {
  try {
    let data = {
      userCount:await User.count(),
      stackCount:await Stack.count(),
      drugCount:await Drug.count(),
      customerCount:await Customer.count(),
      checkCount:await Check.count(),
      factorCount:await Factor.count(),
    }
    return data
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getBackup = async (i18n) => {
  try {
    let uri = "mongodb://localhost:27017/mydb";
    let out = "/Users/yousufmohammadi/Desktop";
    const backupCommand = `mongodump --uri ${uri} --out ${out}`;
    exec(backupCommand, (error, stdout, stderr) => {
      console.log("err" ,  error);
      console.log("stdout" ,  stdout);
      console.log("stderr" ,  stderr);
      if (error) {
      return { message: i18n.__("failed_to_backup") };
      }
    })
    return { message: i18n.__("backup_successfully_done") };
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = { addRoznamcha, getRoznamcha   , getRepository ,  getStatistic ,  getBackup};
