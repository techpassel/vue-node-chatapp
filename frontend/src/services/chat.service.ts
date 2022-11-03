import type MessageGroup from '@/models/MessageGroupModel';
import socketioService from '@/services/socketio.service';
import { subscribeToUserRooms } from '@/services/chatHelper.service';

const joinChatGroups = (groups: MessageGroup[]) => {
    groups.forEach(g => {
        socketioService.joinGroup(g._id, (res: any) => {
            // console.log(res);
        });
    })
    subscribeToUserRooms();
}

export {
    joinChatGroups
}