const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { BellTypeEnum } = require("../utils/enum");

const roznamchaModel = new Schema(
  {
    bellNumber: {
      type: Number,
      trim: true,
    },
    bellType: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      trim: true,
      required: true,
    },
    amount: {
      type: Number,
      trim: true,
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Roznamcha", roznamchaModel);
