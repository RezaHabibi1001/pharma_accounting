const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const graphqlUploadExpress = require("graphql-upload/graphqlUploadExpress.js");
const { createServer } = require("http");
const cors = require("cors");
const { I18n } = require("i18n");
const Sentry = require("./log");
const { redisClient } = require("./utils/redis");
const Employee = require("./models/employee")
const moment = require("moment")
const {getLastMonthHejriDate , getCurrentHejriDate , getNextMonthHejriDate} =  require("./utils/helper")
const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const i18n = new I18n();
const app = express();

i18n.configure({
  locales: ["en"],
  defaultLocale: "en",
  directory: path.join(__dirname, "/locales"),
});

app.use((req, res, next) => {
  req.i18n = i18n;
  next();
});

app.use(graphqlUploadExpress());
app.use(cors());
app.use("/", express.static(path.join(__dirname, "uploads")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS",
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
  );
  next();
});

const apolloServer = require("./apolloServer");
apolloServer
  .start()
  .then(() => {
    apolloServer.applyMiddleware({
      app,
      path: "/api/graphql",
    });
  })
  .catch(error => {
    Sentry.captureException(error);
    throw error;
  });

const server = createServer(app);
const connectWithRetry = () => {
  mongoose.set("strictQuery", true);
  return mongoose.connect(process.env.URI, { family: 4 }, err => {
    if (err) {
      Sentry.captureException(err);
      setTimeout(connectWithRetry, 5000);
    } else {
      // console.log("Connected to mongo DB");
      server.listen(PORT, async () => {
        // console.log(`server is running on port ${PORT}`);
        console.log("Connected To Oxygen Database !");
        try {
          const filter = { lastPaymentDate: { $lt:getLastMonthHejriDate()} };
          let employees = await Employee.find(filter , {lastPaymentDate:1 })
          employees.forEach(async element => {
            let result = await Employee.findOneAndUpdate({_id:element._id} ,
              [
                  { $set: { salary: { $toInt: "$salary" } } },
                  { $set: { balance: { $add: ["$balance", "$salary"] } } },
                  { $set: { lastPaymentDate:  getNextMonthHejriDate(element.lastPaymentDate) } }
            ],
            {new:true}
            )});

          const keys = await redisClient.keys("*");
          await redisClient.del(keys, (err, result) => {});
        } catch (errer) {
          Sentry.captureException(err);
        }
      });
    }
  });
};
connectWithRetry();
