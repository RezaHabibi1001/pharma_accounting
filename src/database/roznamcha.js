const Roznamcha = require("../models/roznamcha");
const Factor = require("../models/factor");
const Check = require("../models/check");
const Customer = require("../models/customer");
const Drug = require("../models/drug");
const Stack = require("../models/stack");
const User = require("../models/user");

const Sentry = require("../log");

const addRoznamcha = async (bellNumber, bellType, date, amount, customer) => {
  const newRoznamcha = new Roznamcha({
    bellNumber,
    bellType,
    date,
    amount,
    customer,
  });
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
    let factorsDifference;
    let checkDifference;
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
    return factorsDifference+checkDifference
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
module.exports = { addRoznamcha, getRoznamcha   , getRepository ,  getStatistic};
