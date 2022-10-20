import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { verifyToken } from '../utils/tokenUtil.js';

const listenSocketIo = async (io) => {
    //Following redis related configuration is particularly needed in case you want to use multiple instances of node servers in you chat app.
    //For more details check - https://socket.io/docs/v3/using-multiple-nodes/#Passing-events-between-nodes

    const pubClient = createClient({ url: "redis://default:bjj234h_364345hjh_j489q3we6_ger673fsf@localhost:6379" });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    console.log("Adaptor connected");
    io.adapter(createAdapter(pubClient, subClient));


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
        console.log('A user is connected', socket.user.id, socket.user.name);

        //Socket.emit() is used to send message to self while io.emit() is used to send message to others(including self)
        //If you want to send message to all except you then use socket.broadcast.emit()
        //And if you want to send message in a room then use socket.to(roomName).emit().

        //Will be triggered if a user exits or disconnect.
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on("join", (roomName, callback) => {
            socket.join(roomName);
            socket.to(roomName).emit(`user joined ${roomName}`, socket.user)
            callback({
                status: "ok"
            })
        });

        socket.on("leave", (roomName, callback) => {
            socket.leave(roomName);
            socket.to(roomName).emit(`user left ${roomName}`, socket.user)
            callback({
                status: "ok"
            })
        });

        socket.on("me typing", (roomName) => {
            socket.to(roomName).emit(`user typing ${roomName}`, socket.user)
        })

        socket.on("me typing end", (roomName) => {
            socket.to(roomName).emit(`user typing end ${roomName}`, socket.user)
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

        socket.on("group message", ({ message, roomName }, callback) => {
            // Data to send to receivers
            const outgoingMessage = {
                user: {
                    id: socket.user.id,
                    name: socket.user.name,
                    imageUrl: socket.user.imageUrl,
                    roomName
                },
                message,
            };

            // To send to all users in room except the sender
            socket.to(roomName).emit(`message ${roomName}`, outgoingMessage);
            callback({
                status: "ok"
            });
        });

        socket.on("delete group message", ({ messageId, roomName }, callback) => {
            // Data to send to receivers
            const outgoingMessage = {
                messageId,
            };

            // To send to all users in room except the sender
            socket.to(roomName).emit(`message ${roomName}`, outgoingMessage);
            callback({
                status: "ok"
            });
        });
    });

}

export default listenSocketIo;