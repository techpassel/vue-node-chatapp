import { getRedisClient } from "../configs/redisConnection.js"
import ChatMessage from '../models/chatMessageModel.js'

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
            activeFriends: [],
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

const saveGroupMessage = async (data) => {
    let newData = {
        groupId: data.groupId,
        message: data.message,
        userId: data.userId,
        // imageUrl: data.imageUrl,
        // videoUrl: data.videoUrl,
        // fileUrl: data.fileUrl,
        isRead: false
    }
    console.log(newData);
    let newMessage = await ChatMessage.create(newData);
    return newMessage;
}

export {
    setRedisClient,
    userJoined,
    userLeft,
    saveGroupMessage
}
