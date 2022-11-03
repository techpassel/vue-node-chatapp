import type MessageGroup from '@/models/MessageGroupModel';
import type Message from '@/models/MessageModel';
import SocketioService from '@/services/socketio.service';

const joinChatGroups = (groups: MessageGroup[]) => {
    groups.forEach(g => {
        SocketioService.joinGroup(g._id, (res: any) => {
            // console.log(res);
        });
    })
    subscribeToUserRooms();
}

const subscribeToUserRooms = () => {
    SocketioService.handleUserJoinedGroup((data: any) => {

    });

    SocketioService.handleUserLeftGroup((data: any) => {

    });

    SocketioService.handleMessageTyping((data: any) => {

    });

    SocketioService.handleMessageTypingEnd((data: any) => {

    });

    SocketioService.subscribeToMessages((data: any) => {

    });

    SocketioService.subscribeToDeleteMessages((data: any) => {

    });
}

const sendMessageInGroup = (message: string, roomId: string) => {
    SocketioService.sendMessageInGroup({ message, roomId }, (msg: Message) => {
        // console.log(msg);
    });
}

export {
    joinChatGroups,
    sendMessageInGroup
}