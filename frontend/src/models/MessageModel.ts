class Message {
    _id!: string;
    groupId!: string;
    message!: string;
    userId!: string;
    imageUrl!: string;
    videoUrl!: string;
    fileUrl!: string;
    isRead!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
}

export default Message;