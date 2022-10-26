import { ref, computed, watch } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import type User from '@/models/UserModel';
import Axios from 'axios';
import { useUserStore } from './userStore'

export const useMessageStore = defineStore('message', () => {
    const messageGroups = ref<User[]>([]);
    const userStore = useUserStore();
    //For state and Getters(i.e. computed properties we need to use 'storeToRefs'  but not for actions)
    const { user } = storeToRefs(userStore);

    const getUsersMessageGroups = async (userId: string) => {
        try {
            let res = await Axios.get(`http://localhost:4000/message//group/by-user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${user.value?.token}`
                }
            });
            console.log(res.data);

            messageGroups.value = res.data;
        } catch (err: any) {
            if (err.response) {
                throw new Error(err.response.data.message);
            } else {
                throw new Error(err.message);
            }
        }
    }

    return {
        messageGroups,
        getUsersMessageGroups
    }
})