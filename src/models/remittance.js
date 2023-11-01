const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { RoleEnum, RemittanceEnum } = require("../utils/enum");

const remittanceModel = new Schema(
  {
    number: {
      type: String,
      trim: true,
      required: true,
    },
    amount: {
      type: Number,
      trim: true,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    shopAddress: {
      type: String,
      trim: true,
      required: true,
    },
    via: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      enum: RemittanceEnum,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Remittance", remittanceModel);
