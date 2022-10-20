import mongoose from "mongoose";

const chatMessageSchema = mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ChatGroup'
    },
    message: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: String,
    },
    imageUrl: {
        type: String,
        required: true
    },
    fileLink: {
        type: String,
        required: false
    },
    isRead: {
        type: String,
        required: true,
        default: false
    }
})

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema)

export default ChatMessage;