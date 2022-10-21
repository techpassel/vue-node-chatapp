import { createAdapter } from "@socket.io/redis-adapter";
import { getRedisClient } from "../configs/redisConnection.js";
import { userJoined, userLeft } from "../servicecs/chatService.js";
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
        // As soon as "setupSocketConnection()" method is called on any client machine it will be fired.
        // It will be called on every new connection request from any client machine.
        await userJoined(socket.user.id, socket.id);

        //Socket.emit() is used to send message to self while io.emit() is used to send message to others(including self)
        //If you want to send message to all except you then use socket.broadcast.emit()
        //And if you want to send message in a room then use socket.to(roomId).emit().

        //Will be triggered if a user exits or disconnect.
        socket.on('disconnect', async () => {
            console.log('User disconnected', socket.user.name);
            let userData = await userLeft(socket.user.id, socket.id);
            // We can use this userData to emit event to inform other users that this user is now offline.
            // We will use it later.
        });

        socket.on("join", async (roomId, callback) => {
            socket.join(roomId);
            socket.to(roomId).emit(`user joined ${roomId}`, socket.user)
            callback({
                status: "ok"
            })
        });

        socket.on("leave", async (roomId, callback) => {
            socket.leave(roomId);
            socket.to(roomId).emit(`user left ${roomId}`, socket.user)
            callback({
                status: "ok"
            })
        });

        socket.on("me typing", (roomId) => {
            socket.to(roomId).emit(`user typing ${roomId}`, socket.user)
        })

        socket.on("me typing end", (roomId) => {
            socket.to(roomId).emit(`user typing end ${roomId}`, socket.user)
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

        socket.on("group message", ({ message, roomId }, callback) => {
            // Data to send to receivers
            const outgoingMessage = {
                user: {
                    id: socket.user.id,
                    name: socket.user.name,
                    imageUrl: socket.user.imageUrl,
                    roomId
                },
                message,
            };

            // To send to all users in room except the sender
            socket.to(roomId).emit(`message ${roomId}`, outgoingMessage);
            callback({
                status: "ok"
            });
        });

        socket.on("delete group message", ({ messageId, roomId }, callback) => {
            // Data to send to receivers
            const outgoingMessage = {
                messageId,
            };

            // To send to all users in room except the sender
            socket.to(roomId).emit(`message ${roomId}`, outgoingMessage);
            callback({
                status: "ok"
            });
        });
    });
}

export default listenSocketIo;