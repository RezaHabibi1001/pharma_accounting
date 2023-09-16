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
module.exports = { addRoznamcha };
