const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { CheckTypeEnum } = require("../utils/enum");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const checkModel = new Schema(
  {
    checkInNumber: {
      type: Number,
      trim: true,
    },
    checkOutNumber: {
      type: Number,
      trim: true,
    },
    checkType: {
      type: String,
      enum: CheckTypeEnum,
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
  },
  { timestamps: true }
);

checkModel.plugin(autoIncrement.plugin, {
  model: "Check",
  field: "checkInNumber",
  startAt: 1,
  incrementBy: 1,
});
checkModel.plugin(autoIncrement.plugin, {
  model: "Check",
  field: "checkOutNumber",
  startAt: 1,
  incrementBy: 1,
});
checkModel.pre("save", function (next) {
  if (this.checkType === "Check_In") {
    console.log("Check_in called");
    this.Check_In = this.Check_In || 0;
    next();
  } else if (this.checkType === "Check_Out") {
    console.log("Check_out called");
    this.Check_Out = this.Check_Out || 0;
    next();
  } else {
    next();
  }
});

module.exports = mongoose.model("Check", checkModel);
