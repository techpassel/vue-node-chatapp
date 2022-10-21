import mongoose, { isObjectIdOrHexString } from "mongoose";

const chatGroupSchema = mongoose.Schema({
    //groupName, isMultiUserGroup and users.isAdmin and users.isAdmin will be used in case of multiuser group only.
    groupName: {
        type: String,
        required: false,
        default: false
    },
    isMultiUserGroup: {
        type: Boolean,
        required: false,
        default: false
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