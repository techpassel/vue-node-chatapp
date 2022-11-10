import type Message from "@/models/MessageModel";
import { useMessageStore } from "@/stores/messageStore";
import socketioService from "./socketio.service";
import type MessageGroup from '@/models/MessageGroupModel';
import TempMessage from "@/models/TempMessageModel";

let messageStore: any = null;

const initializeMessageStore = () => {
    messageStore = useMessageStore();
}

const sendMessageInGroup = (message: string, roomId: string, cb: any) => {
    if (!messageStore) initializeMessageStore();
    socketioService.sendMessageInGroup({ message, roomId }, (data: Message) => {
        messageStore.addMessage(data);
        messageStore.messageGroups.forEach((mg: MessageGroup) => {
            if (mg._id == data.groupId) {
                mg.lastMessage = data;
            }
        })
        cb();
    });
}

const subscribeToUserRooms = () => {
    if (!messageStore) initializeMessageStore();
    socketioService.handleUserJoinedGroup((data: any) => {
        let tm = new TempMessage();
        tm.action = "UserJoined";
        tm.userName = data.user.name;
        tm.userImageUrl = data.user.imageUrl;
        tm.message = `${data.user.name} is online now.`
        if (data.groupId == messageStore.currentRoomInfo.id) {
            messageStore.addMessage(tm);
        }
        messageStore.messageGroups.forEach((mg: MessageGroup) => {
            if (mg._id == data.groupId) {
                mg.lastMessage = tm;
            }
        })
    });

    socketioService.handleUserLeftGroup((data: any) => {
        let tm = new TempMessage();
        tm.action = "UserLeft";
        tm.userName = data.user.name;
        tm.userImageUrl = data.user.imageUrl;
        tm.message = `${data.user.name} went offline.`
        if (data.groupId == messageStore.currentRoomInfo.id) {
            messageStore.addMessage(tm);
        }
        messageStore.messageGroups.forEach((mg: MessageGroup) => {
            if (mg._id == data.groupId) {
                mg.lastMessage = tm;
            }
        })
    });

    socketioService.handleMessageTyping((data: any) => {

    });

    socketioService.handleMessageTypingEnd((data: any) => {

    });

    socketioService.subscribeToMessages((data: any) => {
        if (data.groupId == messageStore.currentRoomInfo.id) {
            messageStore.addMessage(data);
        }
        messageStore.messageGroups.forEach((mg: MessageGroup) => {
            if (mg._id == data.groupId) {
                mg.lastMessage = data;
                if (data.groupId != messageStore.currentRoomInfo.id) {
                    mg.unreadMessageCount++;
                }
            }
        })
    });

    socketioService.subscribeToDeleteMessages((data: any) => {

    });
}

export {
    sendMessageInGroup,
    subscribeToUserRooms
}