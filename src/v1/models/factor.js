const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { FactorTypeEnum, PaymentTypeEnum } = require("../utils/enum");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

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
      required: true,
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

factorModel.plugin(autoIncrement.plugin, {
  model: "Factor",
  field: "buyFactorNumber",
  startAt: 1,
  incrementBy: 1,
});
factorModel.plugin(autoIncrement.plugin, {
  model: "Factor",
  field: "sellFactorNumber",
  startAt: 1,
  incrementBy: 1,
});
factorModel.pre("save", function (next) {
  if (this.factorType === "Buy") {
    this.Buy = this.Buy || 0;
    next();
  } else if (this.factorType === "Sell") {
    this.Sell = this.Sell || 0;
    next();
  } else {
    next();
  }
});

module.exports = mongoose.model("Factor", factorModel);
