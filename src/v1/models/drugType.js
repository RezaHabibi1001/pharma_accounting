const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const drugTypeModel = new Schema(
  {
    title: {
      type: String,
      maxlength: [30, "firstname must be less than 30 characters."],
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);
drugTypeModel.index({ title: "text" });

module.exports = mongoose.model("DrugType", drugTypeModel);
