import Redis from "ioredis";

const REDIS_HOST_DEV = process.env.REDIS_HOST_DEV ? JSON.parse(process.env.REDIS_HOST_DEV) : false;
const REDIS_HOST_PROD = process.env.REDIS_HOST;

if (!REDIS_HOST_DEV && !REDIS_HOST_PROD) {
  throw new Error("❌ Missing REDIS_HOST configuration! only run: npm test");
}

const redis = new Redis.Cluster(
  REDIS_HOST_PROD ? [{ host: REDIS_HOST_PROD }] : REDIS_HOST_DEV || "",
  {
    slotsRefreshTimeout: 5000,
    redisOptions: {
      password: process.env.REDIS_PASSWORD || "",
      connectTimeout: 10000
    }
  }
);

redis.on("error", (err) => {
  throw new Error("❌ Redis Cluster Error:", err);
});

redis.on("connect", () => {
  console.log("✅ Kết nối Redis Cluster thành công!");
});

export default redis;