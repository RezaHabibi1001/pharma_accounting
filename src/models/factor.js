const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { FactorTypeEnum, PaymentTypeEnum } = require("../utils/enum");

const ItemSchema = new mongoose.Schema({
  drug: { type: Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  description: { type: String },
});

const factorModel = new Schema(
  {
    buyFactorNumber: {
      type: Number,
      trim: true,
    },
    sellFactorNumber: {
      type: Number,
      trim: true,
    },
    factorType: {
      type: String,
      enum: FactorTypeEnum,
      required: true,
    },
    paymentType: {
      type: String,
      enum: PaymentTypeEnum,
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
    items: {
      type: [ItemSchema],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Factor", factorModel);
