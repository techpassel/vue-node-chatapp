import type Message from "@/models/MessageModel";
import { useMessageStore } from "@/stores/messageStore";
import socketioService from "./socketio.service";

let messageStore: any = null;

const initializeMessageStore = () => {
    messageStore = useMessageStore();
}

const sendMessageInGroup = (message: string, roomId: string, cb: any) => {
    if (!messageStore) initializeMessageStore();
    socketioService.sendMessageInGroup({ message, roomId }, (data: Message) => {
        messageStore.addMessage(data);
        cb();
    });
}

const subscribeToUserRooms = () => {
    if (!messageStore) initializeMessageStore();
    socketioService.handleUserJoinedGroup((data: any) => {
        console.log("************************");
        console.log(data);
        console.log("************************");
    });

    socketioService.handleUserLeftGroup((data: any) => {

    });

    socketioService.handleMessageTyping((data: any) => {

    });

    socketioService.handleMessageTypingEnd((data: any) => {

    });

    socketioService.subscribeToMessages((data: any) => {
        if (data.groupId == messageStore.currentRoomInfo.id) {
            messageStore.addMessage(data);
        }
        //Here we have to write code for updating last message and unread message count of related message-group.
        //last message will be updated for current group as well as for non-current groups. 
    });

    socketioService.subscribeToDeleteMessages((data: any) => {

    });
}

export {
    sendMessageInGroup,
    subscribeToUserRooms
}