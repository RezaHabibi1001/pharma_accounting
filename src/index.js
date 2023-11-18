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

          const prefix = { $substr: [ "$lastPaymentDate", 0, 5 ] };
          const char6 = { $toInt: { $substr: [ "$lastPaymentDate", 5, 1 ] } };
          const incrementedChar6 = { $add: [ char6, 1 ] };
          const char6String = { $toString: incrementedChar6 };
          const suffix = { $substr: [ "$lastPaymentDate", 6, -1 ] };
          const updatedString = { $concat: [ prefix, char6String, suffix ] };

          Employee.updateMany(filter, [
            { $set: { salary: { $toInt: "$salary" } } }, // Convert salary field to integer
            { $set: { balance: { $add: ["$balance", "$salary"] } } }, // Increment balance field
            { $set: { lastPaymentDate: updatedString } }
          ], (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`${result.modifiedCount} documents updated`);
            }
          });
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
