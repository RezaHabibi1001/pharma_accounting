const Factor = require("../models/factor");
const Customer = require("../models/customer");
const Roznamcha = require("../models/roznamcha");
const { addRoznamcha } = require("./roznamcha");
const { changeExistance, rollbackDrug , changePrice} = require("./drug");
const Sentry = require("../log");
const { ObjectId } = require("mongoose").Types;
const { FactorTypeEnum, PaymentTypeEnum } = require("../utils/enum");
const getFactors = async (pageNumber ,perPage, searchItem ,factorType , paymentType) => {
  !pageNumber ? (pageNumber = 1) : pageNumber;
  !perPage ? (perPage = 50) : perPage;
  let offSet = (pageNumber - 1) * perPage;

  const filter = [{}]
  if(searchItem) {
    filter.push({
      $or: [
        { buyFactorNumber: searchItem},
        { sellFactorNumber:searchItem }
      ]
    });
  }
  if (factorType) {
    filter.push({factorType})
  }
  if (paymentType) {
    filter.push({paymentType})
  }

  const pipline = [
    {
      $sort:{
        createdAt:-1
      }
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  if(pageNumber != -1) {
    pipline.unshift({ $limit: perPage })
    pipline.unshift({ $skip: offSet })
}
  pipline.unshift({$match: { $and: filter }})

  try {
    let factors = await Factor.aggregate(pipline);
    return factors;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const addFactor = async (
  i18n,
  factorType,
  paymentType,
  date,
  amount,
  discount,
  description,
  customer,
  items
) => {
  try {
    let providedData = {
      factorType,
      paymentType,
      date,
      amount,
      discount,
      description,
      customer,
      items,
    }
    const lastFactor  =  await Factor.find({factorType}).sort({createdAt:-1}).limit(1)
    if(lastFactor[0]) {
    if(factorType == FactorTypeEnum.BUY) {
      providedData.buyFactorNumber = lastFactor[0].buyFactorNumber+1
    }else if(factorType == FactorTypeEnum.SELL) {
      providedData.sellFactorNumber = lastFactor[0].sellFactorNumber+1
    }
  }else {
    if(factorType == FactorTypeEnum.BUY) {
      providedData.buyFactorNumber = 1
    }else if(factorType == FactorTypeEnum.SELL) {
      providedData.sellFactorNumber = 1
    }
  }
    
    const newFactor = new Factor(providedData);

    let operator;
    if (paymentType == "No_Cash") {
      if (factorType == "Buy") {
        operator = "+";
      } else if (factorType == "Sell") {
        operator = "-";
      }
    }
    if (operator) {
      await Customer.findOneAndUpdate(
        { _id: ObjectId(customer) },
        { $inc: { balance: operator + (amount-discount) } },
        { new: true }
      );
    }
    let savedFactor = await newFactor.save();
    let bellNumber =
      savedFactor.factorType == "Buy"
        ? savedFactor.buyFactorNumber
        : savedFactor.sellFactorNumber;
    let bellType = factorType;
    if(paymentType == PaymentTypeEnum.CASH) {
      await addRoznamcha(bellNumber, bellType, date, amount, customer);
    }
    await changeExistance(items, factorType);
    if (factorType == "Buy") {
      await changePrice(items);
    }
    return savedFactor;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const deleteFactor = async (i18n, id) => {
  try {
    const {
      amount,
      customer,
      factorType,
      paymentType,
      discount,
      buyFactorNumber,
      sellFactorNumber,
      items,
    } = await Factor.findById(id);
    const { balance } = await Customer.findById({ _id: customer });
    if (factorType == FactorTypeEnum.BUY) {
      const isDeletedRoznamcha = await Roznamcha.findOneAndRemove({
        bellType: FactorTypeEnum.BUY,
        bellNumber: buyFactorNumber,
      });
      if (paymentType == PaymentTypeEnum.NO_CASH) {
        const updatedCustomer = await Customer.findOneAndUpdate(
          { _id: customer },
          { balance: balance - (amount-discount) }
        );
      }
    }
    if (factorType == FactorTypeEnum.SELL) {
      const isDeletedRoznamcha = await Roznamcha.findOneAndRemove({
        bellType: FactorTypeEnum.SELL,
        bellNumber: sellFactorNumber,
      });
      if (paymentType == PaymentTypeEnum.NO_CASH) {
        const updatedCustomer = await Customer.findOneAndUpdate(
          { _id: customer },
          { balance: balance + (amount-discount) }
        );
      }
    }
    await rollbackDrug(items, factorType);
    const isDeletedFactor = await Factor.findByIdAndRemove(id);
    if (isDeletedFactor) {
      return { message: i18n.__("factor_deleted_successfully") };
    }
    return { message: i18n.__("failed_to_delete_factor") };
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const editFactor = async (
  i18n,
  factorId,
  paymentType,
  date,
  amount,
  description,
  customer,
  items
) => {
  function defineBellType() {
    if (oldFactor.factorType == FactorTypeEnum.SELL) {
      return oldFactor.sellFactorNumber;
    } else {
      return oldFactor.buyFactorNumber;
    }
  }
  try {
    const oldFactor = await Factor.findById(factorId);
    // const updateFactor = await Factor.findOneAndUpdate(
    //   { _id: factorId },
    //   {
    //     paymentType,
    //     date,
    //     amount,
    //     description,
    //     customer,
    //     items,
    //   },
    //   { new: true }
    // );

    // if (date) {
    //   const updateRozenamcha = await Roznamcha.findOneAndUpdate(
    //     {
    //       bellType: oldFactor.factorType,
    //       paymentType: oldFactor.paymentType,
    //       bellNumber: defineBellType(),
    //     },
    //     { date }
    //   );
    //   console.log("updateRozenamcha", updateRozenamcha);
    // }

    if (customer != oldFactor.customer) {

      if (oldFactor.paymentType == PaymentTypeEnum.NO_CASH) {
        if (oldFactor.factorType == FactorTypeEnum.SELL) {

          // add old price  to custepmer
          await Customer.findOneAndUpdate(
            { _id: ObjectId(customer) },
            { $inc: { balance: oldFactor.amount } },
            { new: true }
          );
        } else if (oldFactor.factorType == FactorTypeEnum.BUY) {

          // subtract the buy value from customer
          await Customer.findOneAndUpdate(
            { _id: ObjectId(customer) },
            { $inc: { balance: -oldFactor.amount } },
            { new: true }
          );
        }
      }
    }

    return updateFactor;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getLastFactor = async factorType => {
  const pipline = [
    { $match: { factorType } },
    { $sort: { createdAt: -1 } },
    { $limit: 1 },
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "drugs",
        localField: "items.drug",
        foreignField: "_id",
        as: "items.drug",
      },
    },
    {
      $unwind: "$items.drug",
    },
    {
      $lookup: {
        from: "drugtypes",
        localField: "items.drug.drugType",
        foreignField: "_id",
        as: "items.drug.drugType",
      },
    },
    {
      $unwind: "$items.drug.drugType",
    },
    {
      $group: {
        _id: "$_id",
        buyFactorNumber: { $first: "$buyFactorNumber" },
        sellFactorNumber: { $first: "$sellFactorNumber" },
        factorType: { $first: "$factorType" },
        paymentType: { $first: "$paymentType" },
        date: { $first: "$date" },
        amount: { $first: "$amount" },
        discount: { $first: "$discount" },
        description: { $first: "$description" },
        customer: { $first: "$customer" },
        items: { $push: "$items" },
      },
    },
  ];

  try {
    let factors = await Factor.aggregate(pipline);
    return factors[0];
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getFactor = async (id) => {
  const pipeline = [
    {
      $match: { _id: ObjectId(id) },
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "drugs",
        localField: "items.drug",
        foreignField: "_id",
        as: "items.drug",
      },
    },
    {
      $unwind: "$items.drug",
    },
    {
      $lookup: {
        from: "drugtypes",
        localField: "items.drug.drugType",
        foreignField: "_id",
        as: "items.drug.drugType",
      },
    },
    {
      $unwind: "$items.drug.drugType",
    },
    {
      $group: {
        _id: "$_id",
        buyFactorNumber: { $first: "$buyFactorNumber" },
        sellFactorNumber: { $first: "$sellFactorNumber" },
        factorType: { $first: "$factorType" },
        paymentType: { $first: "$paymentType" },
        date: { $first: "$date" },
        amount: { $first: "$amount" },
        discount: { $first: "$discount" },
        description: { $first: "$description" },
        customer: { $first: "$customer" },
        items: { $push: "$items" },
      },
    },
  ];
  

  try {
    const factors = await Factor.aggregate(pipeline);
    if (factors.length === 0) {
      throw new Error("Factor not found");
    }
    return factors[0];
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const getFactorByNumber = async (factorNumber , factorType ) => {
  let filters = [{}];
  filters.push({factorType})
  if(factorType == FactorTypeEnum.BUY) {
    filters.push({buyFactorNumber:factorNumber})
  }
  if(factorType == FactorTypeEnum.SELL) {
    filters.push({sellFactorNumber:factorNumber})
  }
  const pipline = [
    {
      $match: { $and: filters },
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "drugs",
        localField: "items.drug",
        foreignField: "_id",
        as: "items.drug",
      },
    },
    {
      $unwind: "$items.drug",
    },
    {
      $lookup: {
        from: "drugtypes",
        localField: "items.drug.drugType",
        foreignField: "_id",
        as: "items.drug.drugType",
      },
    },
    {
      $unwind: "$items.drug.drugType",
    },
    {
      $group: {
        _id: "$_id",
        buyFactorNumber: { $first: "$buyFactorNumber" },
        sellFactorNumber: { $first: "$sellFactorNumber" },
        factorType: { $first: "$factorType" },
        paymentType: { $first: "$paymentType" },
        date: { $first: "$date" },
        amount: { $first: "$amount" },
        discount: { $first: "$discount" },
        description: { $first: "$description" },
        customer: { $first: "$customer" },
        items: { $push: "$items" },
      },
    },
  ];
  try {
    let factors = await Factor.aggregate(pipline);
    if(factors.length == 0) {
      return new Error(" sorry , No factor found with this number")
    }
    return factors[0];
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
const reportFactors = async (
  factorNumber,
  factorType,
  paymentType,
  customer,
  drug,
  startDate,
  endDate,
  startAmount,
  endAmount
) => {
  const filters = [{}];
  factorType && filters.push({ factorType });
  paymentType && filters.push({ paymentType });
  customer && filters.push({ customer: ObjectId(customer) });
  drug && filters.push({ "items.drug": ObjectId(drug) });

  if (startAmount || endAmount) {
    if (startAmount && endAmount) {
      filters.push({
        amount: { $gte: startAmount, $lte: endAmount },
      });
    } else if (startAmount) {
      filters.push({ amount: { $gte: startAmount } });
    } else if (endAmount) {
      filters.push({ amount: { $lte: endAmount } });
    }
  }

  if (startDate || endDate) {
    if (startDate && endDate) {
      filters.push({
        date: { $gte: startDate, $lte: endDate },
      });
    } else if (startDate) {
      filters.push({ date: { $gte: startDate } });
    } else if (endDate) {
      filters.push({ date: { $lte: endDate } });
    }
  }
  
    if(factorNumber) {
      filters.push(
        {
        $or: [
          {sellFactorNumber:factorNumber},
          {buyFactorNumber:factorNumber},
        ]
      }
    )
  }

  const pipline = [
    {
      $match: { $and: filters },
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  try {
    let factors = await Factor.aggregate(pipline);
    return factors;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
module.exports = {
  getFactors,
  addFactor,
  deleteFactor,
  editFactor,
  getLastFactor,
  reportFactors,
  getFactor,
  getFactorByNumber
};
