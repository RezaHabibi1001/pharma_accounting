const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const profileModle = new Schema(
  {
    titleOne: {
      type: String,
      maxlength: [30, "titleOne must be less than 30 characters."],
      trim: true,
      required: true,
    },
    titleTwo: {
      type: String,
      maxlength: [30, "titleTwo must be less than 30 characters."],
      trim: true,
      required: true,
    },

    owners: {
      type: [String],
      required: true,
      trim: true,
    },
    phones: {
      type: [String],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileModle);
