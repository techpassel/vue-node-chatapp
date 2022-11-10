import { createAdapter } from "@socket.io/redis-adapter";
import { getRedisClient } from "../configs/redisConnection.js";
import { saveGroupMessage, userJoinedGroup, userLeftGroup, userDisconnected } from "../services/chatService.js";
import { verifyToken } from '../utils/tokenUtil.js';

const listenSocketIo = async (io) => {
    //Following redis related configuration is particularly needed in case you want to use 
    //multiple instances of node servers in you chat app.
    //For more details check - https://socket.io/docs/v3/using-multiple-nodes/#Passing-events-between-nodes

    const pubClient = getRedisClient();
    const subClient = pubClient.duplicate();
    await subClient.connect();

    io.adapter(createAdapter(pubClient, subClient));
    console.log("Redis adaptor of socket io set");

    //It will work as a middleware for authentication.
    io.use(async (socket, next) => {
        try {
            let user = await verifyToken(socket.handshake.auth.token);
            socket.user = user
            next();
        } catch (err) {
            return next(new Error(err.message));
        }
    });

    io.on('connection', async (socket, next) => {
        console.log('User connected', socket.user.name);

        //Socket.emit() is used to send message to self while io.emit() is used to send message to others(including self)
        //If you want to send message to all except you then use socket.broadcast.emit()
        //And if you want to send message in a room then use socket.to(roomId).emit().

        //Will be triggered if a user exits or disconnect.
        socket.on('disconnect', () => {
            console.log('User disconnected', socket.user.name);
            setTimeout(async () => {
                let usersGroups = await userDisconnected(socket.user.id, socket.id);
                usersGroups.forEach(groupId => {
                    socket.to(groupId).emit(`user left`, { groupId: groupId, user: socket.user })
                });
            }, 1000 * 60);
            //We are waiting for 2 minutes before considering that user left the group. 
            //As it will be called on page reload or on even tiny network break also.  
        });

        socket.on("join", async (roomId, callback) => {
            socket.join(roomId);
            let res = await userJoinedGroup(roomId, socket.user.id, socket.id);
            if (res != 0)
                socket.to(roomId).emit(`user joined`, { groupId: roomId, socketId: socket.id, user: socket.user })
            callback({
                status: "ok"
            })
        });

        socket.on("leave", async (roomId, callback) => {
            socket.leave(roomId);
            let res = userLeftGroup(roomId, socket.user.id, socket.id);
            if (res != 0)
                socket.to(roomId).emit(`user left`, { groupId: roomId, user: socket.user })
            callback({
                status: "ok"
            })
        });

        socket.on("me typing", (roomId) => {
            socket.to(roomId).emit(`user typing`, { groupId: roomId, user: socket.user })
            callback({
                status: "ok"
            })
        })

        socket.on("me typing end", (roomId) => {
            socket.to(roomId).emit(`user typing end`, { groupId: roomId, user: socket.user })
            callback({
                status: "ok"
            })
        })

        socket.on("self-message", (message, callback) => {
            //This message will be sent to you only.
            socket.emit("for-self", message);
            callback({
                status: "ok"
            })
        })

        socket.on("others-message", (message, callback) => {
            //This message will be sent to everyone except you.
            socket.broadcast.emit("for-others", message);
            callback({
                status: "ok"
            })
        })

        socket.on("all-users-message", (message, callback) => {
            //This message will be sent to everyone including you.
            io.emit("for-all", message);
            callback({
                status: "ok"
            })
        })

        socket.on("group message", async ({ message, roomId }, callback) => {
            let data = {
                groupId: roomId,
                message: message,
                userId: socket.user.id
            }

            let msg = await saveGroupMessage(data);

            // To send to all users in room except the sender
            socket.to(roomId).emit(`message`, msg);
            callback(msg);
        });

        socket.on("delete group message", ({ messageId, roomId }, callback) => {
            // Data to send to receivers
            const outgoingMessage = {
                user: socket.user,
                groupId: roomId,
                messageId: messageId,
            };

            // To send to all users in room except the sender
            socket.to(roomId).emit(`message delete`, outgoingMessage);
            callback({
                status: "ok"
            });
        });
    });
}

export default listenSocketIo;