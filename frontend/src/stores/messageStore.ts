import { ref, computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import Axios from 'axios';
import { useUserStore } from './userStore'
import ChatRoom from '@/models/ChatRoomModel';
import type MessageGroup from '@/models/MessageGroupModel';

export const useMessageStore = defineStore('message', () => {
    const messageGroups = ref<MessageGroup[]>([]);
    const currentRoomId = ref<string>();
    const userStore = useUserStore();
    //For state and Getters(i.e. computed properties we need to use 'storeToRefs'  but not for actions)
    const { user } = storeToRefs(userStore);

    const getUsersMessageGroups = async () => {
        try {
            let res = await Axios.get(`http://localhost:4000/message//group/by-user/${user.value?.id}`, {
                headers: {
                    'Authorization': `Bearer ${user.value?.token}`
                }
            });
            messageGroups.value = res.data;
            if (res.data.length > 0)
                currentRoomId.value = res.data[0]._id;
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
            return data;
        })
    })

    const setCurrentRoomId = (roomId: string) => {
        currentRoomId.value = roomId;
    }

    const currentRoomInfo = computed(() => messageGroupsInFormat.value.find(m => m.id == currentRoomId.value));

    return {
        messageGroups,
        currentRoomInfo,
        getUsersMessageGroups,
        messageGroupsInFormat,
        setCurrentRoomId,
    }
})