const redis = require("redis");
require("dotenv").config();

const redisUrl = process.env.REDIS_URL;
const redisClient = redis.createClient();
redisClient.connect();
redisClient.on(
  "error",
  err => new Error("A network error ocurred with redis!")
);

module.exports = {
  redisClient,
};
