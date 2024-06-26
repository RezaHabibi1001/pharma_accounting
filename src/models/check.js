const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { CheckTypeEnum } = require("../utils/enum");

const checkModel = new Schema(
  {
    checkInNumber: {
      type: Number,
      trim: true,
    },
    checkOutNumber: {
      type: Number,
      trim: true,
    },
    checkType: {
      type: String,
      enum: CheckTypeEnum,
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
    description: {
      type: String,
      trim: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Check", checkModel);
