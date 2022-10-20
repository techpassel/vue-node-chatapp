import { createClient } from "redis";

let redisClient = null;

const connectRedis = () => {
    const REDIS_USERNAME = process.env.REDIS_USERNAME
    const REDIS_PASSWORD = process.env.REDIS_PASSWORD
    const REDIS_HOST = process.env.REDIS_HOST
    const REDIS_PORT = process.env.REDIS_PORT

    redisClient = createClient({ url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}` });
    redisClient.connect();
}

const getRedisClient = () => {
    return redisClient;
}

export {
    connectRedis,
    getRedisClient
}