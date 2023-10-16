const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const drugModel = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    drugType: {
      type: Schema.Types.ObjectId,
      trim: true,
      required: true,
      ref: "DrugType",
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      required: true,
    },
    amount: {
      type: Number,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    stack: {
      type: Schema.Types.ObjectId,
      trim: true,
      required: true,
      ref: "Stack",
    },
    expDate: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drug", drugModel);
