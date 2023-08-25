const Sentry = require("@sentry/node");
require('dotenv').config();

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  tracesSampleRate: 1.0,
  attachStacktrace: true,
});

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});

setTimeout(() => {
  try {
    transaction;
  } catch (e) {
    Sentry.captureException(e);
  }
}, 99);
module.exports = Sentry;