const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const consumeModel = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    consumeNumber : {
      type:Number,
      required:true
    },
    name:{
      type:String,
      trim:true
    },
    amount: {
      type: Number,
      trim: true,
      required: true,
    },
    date: {
      type: String,
      trim: true,
    },
    description:{
      type:String,
      trim:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Consume", consumeModel);
