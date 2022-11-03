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
    latestMsg: string;
    users: Array<ChatUser>;

    constructor() {
        this.id = '';
        this.name = '';
        this.isMultiUserGroup = false;
        this.imageUrl = '';
        this.latestMsg = '';
        this.users = []
    }
}

export default ChatRoom