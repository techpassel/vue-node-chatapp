import type Message from "@/models/MessageModel";
import { useMessageStore } from "@/stores/messageStore";
import socketioService from "./socketio.service";

let messageStore: any = null;

const initializeMessageStore = () => {
    messageStore = useMessageStore();
}

const sendMessageInGroup = (message: string, roomId: string, cb: any) => {
    if (!messageStore) initializeMessageStore();
    socketioService.sendMessageInGroup({ message, roomId }, (msg: Message) => {
        messageStore.addMessage(msg);
        cb();
    });
}

export {
    sendMessageInGroup
}