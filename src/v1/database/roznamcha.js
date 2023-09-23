const Roznamcha = require("../models/roznamcha");
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
module.exports = { addRoznamcha, getRoznamcha };
