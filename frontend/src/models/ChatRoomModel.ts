import type Message from "./MessageModel";

interface ChatUser {
    id: string;
    name: string;
    imageUrl: string;
}

class ChatRoom {
    id: string;
    name: string;
    isMultiUserGroup: boolean;
    imageUrl: string;
    lastMessage: Message | null;
    unreadMessageCount: number;
    users: Array<ChatUser>;

    constructor() {
        this.id = '';
        this.name = '';
        this.isMultiUserGroup = false;
        this.imageUrl = '';
        this.lastMessage = null;
        this.unreadMessageCount = 0;
        this.users = []
    }
}

export default ChatRoom