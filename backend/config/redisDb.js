import redis from "redis";

const connectToRedis = () => {

  const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
  });

  redisClient.on("connect", () => {
    console.log("Redis client connected");
  });

  redisClient.on("error", (err) => {
    console.log(`Something went wrong ${err}`);
  });

  redisClient.on("end", () => {
    console.log("Redis client disconnected");
  });

  return redisClient;
};

export default connectToRedis;
