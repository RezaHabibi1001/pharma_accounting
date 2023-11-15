const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const customerModel = new Schema(
  {
    fullName: {
      type: String,
      maxlength: [30, "firstname must be less than 30 characters."],
      trim: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      maxlength: [15, "phonNumber must be less than 15 characters."],
      trim: true,
    },
    category:{
      type:String,
      trim:true,
      required:true
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    balance: {
      type: Number,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);
customerModel.index({ fullName: "text" });

module.exports = mongoose.model("Customer", customerModel);
