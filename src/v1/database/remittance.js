const Remittance = require("../models/remittance");
const Sentry = require("../../log");

const getRemittances = async () => {
  try {
    const pipline = [
      {
        $sort:{
          createdAt:-1
        }
      }
    ]
    return await Remittance.aggregate(pipline);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addRemittance = async (
  i18n,
  number,
  type,
  amount,
  customerName,
  shopAddress,
  via,
  description,
  date
) => {
  try {
    const newRemittance = new Remittance({
      number,
      type,
      amount,
      customerName,
      shopAddress,
      via,
      description,
      date,
    });
    return await newRemittance.save();
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteRemittance = async (i18n, id) => {
  try {
    const isDeletedRemittance = await Remittance.findByIdAndRemove(id);
    if (isDeletedRemittance) {
      return { message: i18n.__("remittance_deleted_successfully") };
    } else {
      return { message: i18n.__("failed_to_delete_remittance") };
    }
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editRemittance = async (
  i18n,
  remittanceId,
  number,
  type,
  amount,
  customerName,
  shopAddress,
  via,
  description,
  date
) => {
  try {
    return await Remittance.findOneAndUpdate(
      { _id: remittanceId },
      {
        number,
        type,
        amount,
        customerName,
        shopAddress,
        via,
        description,
        date,
      },
      { new: true }
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getRemittances,
  addRemittance,
  deleteRemittance,
  editRemittance,
};
