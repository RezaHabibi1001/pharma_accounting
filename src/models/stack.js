const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const stackModel = new Schema(
  {
    name: {
      type: String,
      maxlength: [30, "firstname must be less than 30 characters."],
      trim: true,
      required: true,
    },
    type: {
      type: String,
      maxlength: [30, "type must be less than 30 characters."],
      trim: true,
      required: true,
    },
    address: {
      type: String,
      maxlength: [30, "adddress must be less than 30 characters."],
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);
stackModel.index({ name: "text" });

module.exports = mongoose.model("Stack", stackModel);
