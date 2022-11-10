import { getRedisClient } from "../configs/redisConnection.js";
import ChatMessage from '../models/chatMessageModel.js'

let redisClient = null;

const setRedisClient = async () => {
    redisClient = await getRedisClient();
}

const userJoinedGroup = async (groupId, userId, socketId) => {
    let res = await redisClient.sAdd(`user-groups-${userId}`, groupId)
    setUserSocket(userId, socketId)
    return res;
}

const setUserSocket = async (userId, socketId) => {
    let existingSocketId = await redisClient.get(`user-socket-${userId}`);
    if (!existingSocketId || existingSocketId != socketId)
        await redisClient.set(`user-socket-${userId}`, socketId);
}

const userLeftGroup = async (groupId, userId) => {
    let res = await redisClient.sRem(`user-groups-${userId}`, groupId);
    deleteUserGroupIfEmpty(userId);
    return res;
}

const deleteUserGroupIfEmpty = async (userId) => {
    let userGroupsLength = await redisClient.sCard(`user-groups-${userId}`);
    if (userGroupsLength == 0) {
        await redisClient.del(`user-groups-${userId}`)
    }
}

const userDisconnected = async (userId, socketId) => {
    let existingSocketId = await redisClient.get(`user-socket-${userId}`);
    let usersGroups = []
    if (existingSocketId && existingSocketId == socketId) {
        usersGroups = await redisClient.sMembers(`user-groups-${userId}`);
        deleteUserSocketAndUserGroup(userId);
    }
    return usersGroups;
}

const deleteUserSocketAndUserGroup = async (userId) => {
    await redisClient.del(`user-socket-${userId}`)
    await redisClient.del(`user-groups-${userId}`)
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
    let newMessage = await ChatMessage.create(newData);
    return newMessage;
}

export {
    setRedisClient,
    userJoinedGroup,
    userLeftGroup,
    userDisconnected,
    saveGroupMessage
}
