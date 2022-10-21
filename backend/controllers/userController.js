import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { uploadFile, deleteFile } from '../utils/fileUploadUtil.js';
import { generateToken } from '../utils/tokenUtil.js';

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    // const image = req.files.image[0].path;
    const image = req.file.path;
    const imageUrl = await uploadFile(image, "profile-image");

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        imageUrl
    });

    if (user) {
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            imageUrl: user.imageUrl,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const authenticateUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        if ((await user.matchPassword(password))) {
            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                imageUrl: user.imageUrl,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Incorrect password');
        }
    } else {
        res.status(401)
        throw new Error('Invalid email');
    }
})

const searchUser = asyncHandler(async (req, res) => {
    //Url should be in format - http://localhost:4000/user/search?key=am
    const { key } = req.query;
    const regex = new RegExp(key, 'i') // i for case insensitive
    console.log(regex);
    const users = await User.find({
        $or:
            [
                { name: { $regex: regex } },
                { email: key }
            ]
    }).select({ _id: 1, name: 1, imageUrl: 1 })
    res.send(users);
})

export {
    registerUser,
    authenticateUser,
    searchUser
}