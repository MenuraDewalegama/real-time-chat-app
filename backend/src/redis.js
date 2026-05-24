const Redis = require("ioredis");

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    if (times > 10) return null; // Stop retrying after 10 attempts
    return Math.min(times * 200, 2000); // Backoff: 200ms, 400ms ... up to 2s
  }
};

const pub = new Redis(redisConfig);
const sub = new Redis(redisConfig);

pub.on("error", (err) => console.error("Redis pub error:", err.message));
sub.on("error", (err) => console.error("Redis sub error:", err.message));

module.exports = { pub, sub };
