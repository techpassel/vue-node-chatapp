import mongoose from "mongoose";

const chatMessageSchema = mongoose.Schema(
    {
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'ChatGroup'
        },
        message: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        imageUrl: {
            type: String,
            required: false
        },
        videoUrl: {
            type: String,
            required: false
        },
        fileUrl: {
            type: String,
            required: false
        },
        isRead: {
            type: String,
            required: true,
            default: false
        },
    },
    {
        timestamps: true,
    }
)

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema)

export default ChatMessage;