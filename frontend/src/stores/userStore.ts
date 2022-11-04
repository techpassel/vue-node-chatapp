import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type User from '@/models/UserModel'
import Axios from 'axios';
import router from '@/router';
import SocketioService from '@/services/socketio.service';

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null);
    const uploadPercentage = ref<number>(0);
    const searchedUsers = ref<User[]>([]);

    const signup = async (data: any) => {
        try {
            const res = await Axios.post('http://localhost:4000/user/auth',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    /*
                    //Following code is to monitor the uploded file(image) in percentage.
                    onUploadProgress: function (progressEvent_1: any) {
                        uploadPercentage.value = Math.round((progressEvent_1.loaded / progressEvent_1.total) * 100);
                    }
                    */
                }
            );
            user.value = res.data;
            SocketioService.setupSocketConnection();
            return "Success";
        } catch (err: any) {
            if (err.response) {
                if (err.response.status == 400) {
                    throw new Error("emailExist");
                } else {
                    throw new Error(err.response.data.message);
                }
            } else {
                throw new Error(err.message);
            }
        }
    }

    const login = async (data: any) => {
        try {
            const res = await Axios.post('http://localhost:4000/user/auth/login',
                data,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            user.value = res.data;
            SocketioService.setupSocketConnection();
            return "Success";
        } catch (err: any) {
            if (err.response) {
                throw new Error(err.response.data.message);
            } else {
                throw new Error(err.message);
            }
        }
    }

    const logout = () => {
        SocketioService.disconnect();
        user.value = null;
        router.push('/auth/login')
    }

    const searchUser = async (str: string) => {
        try {
            let res = await Axios.get(`http://localhost:4000/user/search?key=${str}`, {
                headers: {
                    'Authorization': `Bearer ${user.value?.token}`
                }
            });
            searchedUsers.value = res.data;
        } catch (err: any) {
            if (err.response) {
                throw new Error(err.response.data.message);
            } else {
                throw new Error(err.message);
            }
        }
    }

    const persistingUser = localStorage.getItem("user");
    if (persistingUser) {
        user.value = JSON.parse(persistingUser);
    }

    watch(user, val => {
        if (val) localStorage.setItem('user', JSON.stringify(val));
        else localStorage.removeItem('user')
    }, { deep: true })

    return {
        user,
        signup,
        login,
        uploadPercentage,
        logout,
        searchUser
    }
})
