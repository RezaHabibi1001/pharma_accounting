const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const salaryModel = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    salaryNumber : {
      type:Number,
      required:true
    },
    amount: {
      type: Number,
      trim: true,
      required: true,
    },
    date: {
      type: String,
      trim: true,
      required: true,
    },
    description:{
      type:String,
      trim:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Salary", salaryModel);
