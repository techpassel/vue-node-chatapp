import { getRedisClient } from "../configs/redisConnection.js"

let redisClient = null;

const setRedisClient = async () => {
    redisClient = await getRedisClient();
}

const userJoined = async (userId, socketId) => {
    let user = await redisClient.get(userId);
    let data = null;
    if (!user) {
        data = {
            socketIds: [socketId],
            activeVideoChatGroup: null,
        }
    } else {
        data = JSON.parse(user);
        data.socketIds.push(socketId);
    }
    await redisClient.set(userId, JSON.stringify(data))
}

const userLeft = async (userId, socketId) => {
    let userData = null;
    let user = await redisClient.get(userId);
    if (user) {
        userData = JSON.parse(user);
        let remainingSocketIds = userData.socketIds.filter(u => u != socketId)
        if (remainingSocketIds.length == 0)
            await redisClient.del(userId)
        else {
            userData.socketIds = remainingSocketIds
            await redisClient.set(userId, JSON.stringify(userData))
        }
    }
    return userData;
}

export {
    setRedisClient,
    userJoined,
    userLeft
}