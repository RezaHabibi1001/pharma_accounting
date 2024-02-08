const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const periodModel = new Schema(
  {
    name: {
      type: String,
      maxlength: [30, "period must be less than 30 characters."],
      trim: true,
      required: true,
    },
    isClosed:{
        type:Boolean,
        default:false
      }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Period", periodModel);
