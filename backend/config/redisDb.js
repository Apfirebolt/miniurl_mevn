import redis from "redis";

const connectToRedis = () => {

  const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
  });

};

export default connectToRedis;
