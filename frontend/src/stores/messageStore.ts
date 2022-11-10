import { ref, computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import Axios from 'axios';
import { useUserStore } from './userStore'
import ChatRoom from '@/models/ChatRoomModel';
import type MessageGroup from '@/models/MessageGroupModel';
import { joinChatGroups } from '@/services/chat.service';
import type Message from '@/models/MessageModel';
import TempMessage from '@/models/TempMessageModel';

export const useMessageStore = defineStore('message', () => {
    const messageGroups = ref<MessageGroup[]>([]);
    const messages = ref<(Message | TempMessage)[]>([]);
    const messagesPageNum = ref<number>(0);
    const lastMessageCreatedOn = ref<Date>(new Date());
    const isFetchingMessages = ref<boolean>(false);
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
                getMessageGroupMessages(res.data[0]._id, true);
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
            data.lastMessage = group.lastMessage;
            data.unreadMessageCount = group.unreadMessageCount;
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
            getMessageGroupMessages(roomId, true);
        }
    }

    const currentRoomInfo = computed(() => {
        messageGroups.value = messageGroups.value.map(m => {
            if (m._id == currentRoomId.value && m.unreadMessageCount > 0) {
                m.unreadMessageCount = 0;
                markMessageAsRead(currentRoomId.value);
            }
            return m;
        })

        return messageGroupsInFormat.value.find(m => m.id == currentRoomId.value)
    });

    const markMessageAsRead = async (groupId: string) => {
        try {
            let res = await Axios.post(`http://localhost:4000/message//mark-read`,
                {
                    groupId,
                    tillTime: new Date()
                },
                {
                    headers: {
                        'Authorization': `Bearer ${user.value?.token}`
                    }
                });
        } catch (err: any) {
            if (err.response) {
                throw new Error(err.response.data.message);
            } else {
                throw new Error(err.message);
            }
        }
    }

    const getMessageGroupMessages = async (roomId: string, isNewRoom: boolean) => {
        try {
            isFetchingMessages.value = true
            if (isNewRoom) {
                messagesPageNum.value = 0;
                lastMessageCreatedOn.value = new Date();
            }
            let res = await Axios.get(`http://localhost:4000/message/group/messages/${roomId}/${messagesPageNum.value}/${lastMessageCreatedOn.value}`, {
                headers: {
                    'Authorization': `Bearer ${user.value?.token}`
                }
            });
            if (isNewRoom) {
                messages.value = res.data.reverse();
                if (res.data.length > 0)
                    lastMessageCreatedOn.value = new Date(res.data[res.data.length - 1]['createdAt']);
            } else {
                if (res.data.length == 0) {
                    let tm = new TempMessage();
                    tm.action = "NoMoreMessageInGroup";
                    tm.message = `No more messages.`
                    addMessage(tm);
                } else {
                    let newData = res.data.reverse();
                    messages.value = newData.concat(messages.value);
                }
            }
            isFetchingMessages.value = false
        } catch (err: any) {
            isFetchingMessages.value = false
            if (err.response) {
                throw new Error(err.response.data.message);
            } else {
                throw new Error(err.message);
            }
        }
    }

    const addMessage = (data: Message | TempMessage) => {
        messages.value = [...messages.value, data]
    }

    return {
        messages,
        messageGroups,
        currentRoomInfo,
        currentRoomId,
        getUsersMessageGroups,
        messageGroupsInFormat,
        setCurrentRoomId,
        getMessageGroupMessages,
        addMessage,
        markMessageAsRead
    }
})