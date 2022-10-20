import mongoose, { isObjectIdOrHexString } from "mongoose";
import User from "./userModel";

const chatGroupSchema = mongoose.Schema({
    isMultiUserGroup: {
        type: Boolean,
        required: false,
        default: false
    },
    superAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    users: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
                //The ref option is what tells Mongoose which model to use during population, in our case the Story model.
            },
            isAdmin: {
                type: Boolean,
                required: true,
                default: false
            },
            isMuted: {
                type: Boolean,
                required: false,
                default: false
            }
        }
    ]
})

const ChatGroup = mongoose.model('ChatGroup', chatGroupSchema);

export default ChatGroup;