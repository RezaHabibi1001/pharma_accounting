const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { RoleEnum } = require("../utils/enum");
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
    role: {
      type: String,
      enum: RoleEnum,
    },
  },
  { timestamps: true }
);
userModel.index({ userName: "text" });
userModel.index({ firstName: "text" });
userModel.index({ lastName: "text" });

module.exports = mongoose.model("User", userModel);
