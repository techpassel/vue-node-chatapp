import type MessageGroup from '@/models/MessageGroupModel';
import SocketioService from '@/services/socketio.service'

const joinChatGroups = (groups: MessageGroup[]) => {
    groups.forEach(g => {
        SocketioService.joinGroup(g._id, (res: any) => {
            console.log(res);
        });
    })
    subscribeToUserRooms();
}

const subscribeToUserRooms = () => {
    SocketioService.handleUserJoinedGroup((data: any) => {

    });

    SocketioService.handleUserLeftGroup((data: any) => {

    });

    SocketioService.HandleMessageTyping((data: any) => {

    });

    SocketioService.HandleMessageTypingEnd((data: any) => {

    });

    SocketioService.subscribeToMessages((data: any) => {

    });

    SocketioService.subscribeToDeleteMessages((data: any) => {

    });
}

const abc = (data: any) => {
    console.log(data);
}

export {
    joinChatGroups
}