import { ref, computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import Axios from 'axios';
import { useUserStore } from './userStore'
import ChatRoom from '@/models/ChatRoomModel';
import type MessageGroup from '@/models/MessageGroupModel';
import { joinChatGroups } from '@/services/chat.service';
import type Message from '@/models/MessageModel';

export const useMessageStore = defineStore('message', () => {
    const messageGroups = ref<MessageGroup[]>([]);
    const messages = ref<Message[]>([]);
    const currentRoomId = ref<string>();
    const userStore = useUserStore();
    //For state and Getters(i.e. computed properties we need to use 'storeToRefs' but not for actions)
    const { user } = storeToRefs(userStore);

    const getUsersMessageGroups = async () => {
        try {
            let res = await Axios.get(`http://localhost:4000/message/group/by-user/${user.value?.id}`, {
                headers: {
                    'Authorization': `Bearer ${user.value?.token}`
                }
            });
            if (res.data?.length > 0) {
                messageGroups.value = res.data;
                currentRoomId.value = res.data[0]._id;
                getMessageGroupMessages(res.data[0]._id);
                joinChatGroups(res.data);
            }
        } catch (err: any) {
            if (err.response) {
                throw new Error(err.response.data.message);
            } else {
                throw new Error(err.message);
            }
        }
    }

    const messageGroupsInFormat = computed(() => {
        return messageGroups.value.map(group => {
            let data = new ChatRoom();
            data.id = group._id;
            data.isMultiUserGroup = group.isMultiUserGroup;
            data.latestMsg = group.lastMsg ? group.lastMsg : '';
            data.users = [];
            if (group.isMultiUserGroup) {
                data.name = group.groupName;
                data.imageUrl = group.groupImageUrl;
            } else {
                const otherUser = group.users.find(u => u.userId != user.value?.id)
                if (otherUser) {
                    data.name = otherUser?.info.name
                    data.imageUrl = otherUser?.info.imageUrl
                }
            }
            group.users.forEach(g => {
                let user = {
                    id: g.userId,
                    name: g.info.name,
                    imageUrl: g.info.imageUrl
                }
                data.users.push(user);
            })
            return data;
        })
    })

    const setCurrentRoomId = (roomId: string) => {
        if (currentRoomId.value != roomId) {
            currentRoomId.value = roomId;
            getMessageGroupMessages(roomId);
        }
    }

    const currentRoomInfo = computed(() => {
        return messageGroupsInFormat.value.find(m => m.id == currentRoomId.value)
    });

    const getMessageGroupMessages = async (roomId: string) => {
        try {
            let res = await Axios.get(`http://localhost:4000/message/group/messages/${roomId}`, {
                headers: {
                    'Authorization': `Bearer ${user.value?.token}`
                }
            });
            messages.value = res.data;
        } catch (err: any) {
            if (err.response) {
                throw new Error(err.response.data.message);
            } else {
                throw new Error(err.message);
            }
        }
    }

    const addMessage = (data: Message) => {
        messages.value = [...messages.value, data]
    }

    return {
        messages,
        messageGroups,
        currentRoomInfo,
        getUsersMessageGroups,
        messageGroupsInFormat,
        setCurrentRoomId,
        getMessageGroupMessages,
        addMessage
    }
})