import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './configs/dbConnection.js';
import userRoutes from '../backend/routes/userRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import { initializeS3FS } from './utils/fileUploadUtil.js';

//We should always call it on the top. If you use "process.env" before calling it then you will get null for that.
//So better call it on the top to avoid any mistake.
dotenv.config();
const PATH = process.env.PORT || 5000;

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

app.listen(
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