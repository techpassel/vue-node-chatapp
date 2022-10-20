import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './configs/dbConnection.js';
import userRoutes from '../backend/routes/userRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import { initializeS3FS } from './utils/fileUploadUtil.js';
import { Server } from 'socket.io';
import listenSocketIo from './utils/sockeketUtil.js';
import { connectRedis } from './configs/redisConnection.js';
import { setRedisClient } from './servicecs/chatService.js';

//We should always call it on the top. If you use "process.env" before calling it then you will get null for that.
//So better call it on the top to avoid any mistake.
dotenv.config();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

connectDB();
connectRedis();
initializeS3FS();
setRedisClient();

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

listenSocketIo(io);

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