import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './configs/dbConnection.js';
import userRoutes from '../backend/routes/userRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import { initializeS3FS } from './utils/fileUploadUtil.js';
import { Server } from 'socket.io';
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { verifyToken } from './utils/tokenUtil.js';

//We should always call it on the top. If you use "process.env" before calling it then you will get null for that.
//So better call it on the top to avoid any mistake.
dotenv.config();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

connectDB();
initializeS3FS();

const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
};

const app = express();

app.use(allowCrossDomain);
app.use(express.json());

//Serves all the request which includes /images in the url from 'public' folder
app.use('/uploads', express.static(__dirname + '/uploads'));

/*
//Simple way to create and start an express server.
----------------------------------------------------------------------------------
app.listen(
    PORT,
    console.log(
        `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
).on('error', err => console.log("Server can't be started. Error :" + err));
----------------------------------------------------------------------------------
But here we will use a different method.Actuall this alternate method is mainly useful with https modules
(i.e for servers in which you need to transfer data over https).Here we will not use https module instead we will use http module.
But the method is very similar for both.In case of https server we will need few additional parameters.Example of https server:
----------------------------------------------------------------------------------
import https from 'https';
const privateKey  = fs.readFileSync('certificates/key.pem', 'utf8');
const certificate = fs.readFileSync('certificates/cert.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const server = https.createServer(credentials, app);
//Now you can start server as follows :
server.listen(5500);
----------------------------------------------------------------------------------
*/

const server = http.createServer(app);

// Creating a 'socket.io' server instance.
// Here 'Server' is imported from 'socket.io' module and 'server' is defined above.
const io = new Server(server, {
    cors: {
        // origin: '*',
        origins: ['http://localhost:5173'],
        methods: ['GET', 'POST']
    }
});

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

server.listen(
    PORT,
    console.log(
        `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
).on('error', err => console.log("Server can't be started. Error :" + err));

//test -api
app.get('/test', (req, res) => {
    res.send("Server working")
});

app.use('/user', userRoutes);

app.use(notFound)
app.use(errorHandler)