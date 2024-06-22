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
const multer = require('multer');
const Profile = require("./models/profile");
const fs = require('fs');
const archiver = require('archiver');

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
let logoSuffix;
let barcodeSuffix;
// upload logo started
const logoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `/var/www/oxygenImages`)
  },
  filename: function (req, file, cb) {
    logoSuffix = path.extname(file.originalname);
     cb(null,`logo${Math.random()}${logoSuffix}`);
  }
});
const upload = multer({ storage: logoStorage });
app.post('/uploadLogo', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
  let url =`logo${Math.random()}${logoSuffix}`
  await Profile.findOneAndUpdate({},{logo:url},{ new: true });
  res.send('File uploaded successfully.');
});
// upload barcode started
const barcodeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `/var/www/oxygenImages`)
  },
  filename: function (req, file, cb) {
    barcodeSuffix = path.extname(file.originalname);
     cb(null,`barcode${Math.random()}${barcodeSuffix}`);
  }
});
const upload2 = multer({ storage: barcodeStorage });
app.post('/uploadBarcode', upload2.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
  let url =`barcode${Math.random()}${barcodeSuffix}`
  await Profile.findOneAndUpdate({ },{barcode:url},{ new: true });
  res.send('File uploaded successfully.');
});

app.get('/download', (req, res) => {
  const directoryPath = req.query.path; // Get the path from the query parameter

  // Check if the directory path is provided
  if (!directoryPath) {
    return res.status(400).send('Directory path is required');
  }

  // Resolve the directory path
  const resolvedPath = path.resolve(directoryPath);

  // Check if directory exists
  if (!fs.existsSync(resolvedPath)) {
    return res.status(404).send('Directory not found');
  }

  // Create a zip archive
  const archive = archiver('zip', {
    zlib: { level: 9 } // Set the compression level
  });

  // Handle errors
  archive.on('error', (err) => {
    res.status(500).send({ error: err.message });
  });

  // Set the response headers
  res.attachment('directory.zip');

  // Pipe the archive data to the response
  archive.pipe(res);

  // Append files from the directory to the archive
  archive.directory(resolvedPath, false);
  
  // Finalize the archive
  archive.finalize();
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
}
  )}
connectWithRetry();
