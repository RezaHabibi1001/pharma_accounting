const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeModel = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    job: {
      type: String,
      trim: true,
      required: true,
    },
    contractDate: {
      type: String,
      trim: true,
      required: true,
    },
    workTime: {
      type: String,
      trim: true,
      required: true,
    },
    salary: {
      type: Number,
      trim: true,
      required: true,
    },
    balance:{
      type:Number,
      trim:true,
      default:0
    },
    lastPaymentDate: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeModel);
