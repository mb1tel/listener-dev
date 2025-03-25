import Redis from "ioredis";

const REDIS_HOST_DEV = process.env.REDIS_HOST_DEV || null;
const REDIS_HOST_PROD = process.env.REDIS_HOST || null;

if (!REDIS_HOST_DEV && !REDIS_HOST_PROD) {
  throw new Error("❌ Missing REDIS_HOST configuration! only run: npm test");
}

let redis;

if (REDIS_HOST_DEV) {
  redis = new Redis({
    host: REDIS_HOST_DEV,
    port: 6379,
    password: process.env.REDIS_PASSWORD || "",
    db: 0,
    connectTimeout: 5000
  });
} else {
  redis = new Redis.Cluster(
    [{ host: REDIS_HOST_PROD }],
    {
      slotsRefreshTimeout: 5000,
      redisOptions: {
        password: process.env.REDIS_PASSWORD || "",
        connectTimeout: 10000
      }
    }
  );
}

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

redis.on("connect", () => {
  console.log(`✅ Kết nối Redis ${REDIS_HOST_DEV ? "Dev" : "Cluster"} thành công!`);
});

export default redis;