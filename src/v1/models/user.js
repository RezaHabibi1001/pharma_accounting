const { ProviderEnum } = require("../utils/enum");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModel = new Schema(
  {
    firstName: {
      type: String,
      maxlength: [30, "firstname must be less than 30 characters."],
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      maxlength: [30, "lastname must be less than 30 characters."],
      trim: true,
      required: true,
    },
    email: {
      type: String,
      minlength: [5, "Email must be more than 5 characters."],
      maxlength: [80, "Email must be less than 80 characters."],
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      unique: false,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);
userModel.index({ username: "text" });
userModel.index({ firstname: "text" });
userModel.index({ lastname: "text" });

module.exports = mongoose.model("User", userModel);
