const Consume = require("../models/consume");
const Roznamcha = require("../models/roznamcha");
const Sentry = require("../log");
const { addRoznamcha } = require("./roznamcha");
const { ObjectId } = require("mongoose").Types;
const getConsumes = async () => {
  const pipline = [
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userId",
      },
    },
    {
      $unwind: {
        path: "$userId",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  try {
    let consumes = await Consume.aggregate(pipline);
    return consumes;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addConsume = async (
  i18n,
  name,
  amount,
  date,
  description,
  userId
) => {
  try {
    let providedData = {
      name,
      amount,
      date,
      description,
      userId
    }
    const lastConsume  =  await Consume.find({}).sort({createdAt:-1}).limit(1)
    if(lastConsume[0]) {
      providedData.consumeNumber = lastConsume[0].consumeNumber+1
    }else {
      providedData.consumeNumber = 1
    }
    const newConsume = new Consume(providedData);
    let savedConsume = await newConsume.save();
    await addRoznamcha(providedData.consumeNumber, "consume", date, amount, userId);
    return savedConsume;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteConsume = async (i18n, id) => {
  try {
    const { amount, name, date ,  consumeNumber } = await Consume.findById(id);

      const isDeletedRoznamcha = await Roznamcha.findOneAndRemove({
        bellType:"consume",
        bellNumber: consumeNumber,
      });
      if (isDeletedRoznamcha) {
        const isDeletedConsume = await Consume.findByIdAndRemove(id);
        return { message: i18n.__("consume_deleted_successfully") };
      }
    return { message: i18n.__("failed_to_delete_consume") };
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

module.exports = {
getConsumes,
addConsume,
deleteConsume
};
