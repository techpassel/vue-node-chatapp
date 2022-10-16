import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const verifyToken = async (token) => {
    let rejectReason = "";
    let user = null;
    let decodedToken = null;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        rejectReason = "Invalid token";
    }

    if (decodedToken) {
        var dateNow = new Date();
        if (decodedToken.exp < dateNow.getTime() / 1000) {
            rejectReason = "Token is expired";
        } else {
            try {
                // user = await User.findById(decodedToken.id).select({
                //     id: 1
                // });
                user = await User.findById(decodedToken.id).select({ password: 0 });
                if (!user) {
                    rejectReason = "Invalid token";
                }
            } catch (error) {
                rejectReason = "Invalid token3";
            }
        }
    }
    if (rejectReason.trim() == '' && user) {
        return user;
    } else {
        throw new Error(rejectReason);
    }
}

export {
    generateToken,
    verifyToken
}