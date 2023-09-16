const RoleEnum = {
  ADMIN: "Admin",
  STANDARD: "Standard",
  GUEST: "Guest",
};
const RemittanceEnum = {
  CARD_TO_CARD: "Card_to_card",
  EXCHANGE: "Exchange",
};
const CheckTypeEnum = {
  CHECK_IN: "Check_In",
  CHECK_OUT: "Check_Out",
};
const FactorTypeEnum = {
  BUY: "Buy",
  SELL: "Sell",
};
const PaymentTypeEnum = {
  CASH: "Cash",
  NO_CASH: "No_Cash",
};

module.exports = {
  RoleEnum,
  RemittanceEnum,
  CheckTypeEnum,
  FactorTypeEnum,
  PaymentTypeEnum,
};
