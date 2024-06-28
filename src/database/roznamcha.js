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
const Sentry = require("../log");
const { MongoClient } = require('mongodb');
const mongoose = require("mongoose");

const fs = require('fs');
const path = require('path');
const moment = require('moment-jalaali');
const {getLastMonthHejriDate , getCurrentHejriDate , getNextMonthHejriDate} =  require("./../utils/helper")

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
const getBackup = async (i18n ,dbName) => {
  try {
      const uri = 'mongodb://localhost:27017';
      const dbName = process.env.DB_NAME
      const now = moment();
      const backupDate =  now.format('jYYYY-jMM-jDD');

      const outputDir = `/var/www/omid_oxygen/backups/${dbName}-${backupDate}`;
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      
        await client.connect();
        const db = client.db(dbName);

        // Fetch all collections in the database
        const collections = await db.listCollections().toArray();

        if (!fs.existsSync("/var/www/omid_oxygen/backups")) {
          fs.mkdirSync("/var/www/omid_oxygen/backups");
      }
        // Create backup directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Loop through collections and fetch documents
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            const collection = db.collection(collectionName);
            const documents = await collection.find({}).toArray();

            // Create a directory for the collection if it doesn't exist
            const collectionDir = path.join(outputDir, collectionName);
            if (!fs.existsSync(collectionDir)) {
                fs.mkdirSync(collectionDir);
            }

            // Write each document to a separate JSON file
            documents.forEach((document) => {
                const fileName = path.join(collectionDir, `${collectionName}.json`);
                fs.writeFileSync(fileName, JSON.stringify(document));
            });
        }

  return { message: `${outputDir}` };
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const selectDatabase = async (i18n ,dbName) => {

  await mongoose.connection.close();
  mongoose.set("strictQuery", true);
  mongoose.connect(`mongodb://localhost:27017/${dbName}`, { family: 4 }, async (err) =>  {
    if (err) {
      console.log("failed connection");
      Sentry.captureException(err);
    } else {
        console.log('Connected To ');
          const filter = { lastPaymentDate: { $lt:getLastMonthHejriDate()} };
          let employees = await Employee.find(filter , {lastPaymentDate:1 })
          employees.forEach(async element => {
            let result = await Employee.findOneAndUpdate({_id:element._id} ,
              [
                  { $set: { salary: { $toInt: "$salary" } } },
                  { $set: { balance: { $add: ["$balance", "$salary"] } } },
                  { $set: { lastPaymentDate:  getNextMonthHejriDate(element.lastPaymentDate) } }
            ],
            {new:true}
            )});
          }
        });
        return { message: i18n.__("database_selected_successfully") };
      };
module.exports = { addRoznamcha, getRoznamcha   , getRepository ,  getStatistic ,  getBackup ,  selectDatabase};
