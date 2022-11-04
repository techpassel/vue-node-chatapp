import type Message from "./MessageModel";

interface MessageGroupUser {
    _id: string;
    userId: string;
    isMuted: boolean;
    isAdmin: boolean;
    info: {
        name: string;
        imageUrl: string;
    }
}

interface MessageGroup {
    _id: string;
    groupName: string;
    isMultiUserGroup: boolean;
    groupImageUrl: string;
    lastMessage: Message;
    users: Array<MessageGroupUser>
}

export default MessageGroup;