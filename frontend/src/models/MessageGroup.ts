class MessageGroup {
    id: string;
    name: string;
    isMultiUserGroup: boolean;
    imageUrl: string;
    latestMsg: string;

    constructor() {
        this.id = '';
        this.name = '';
        this.isMultiUserGroup = false;
        this.imageUrl = '';
        this.latestMsg = '';
    }
}

export default MessageGroup