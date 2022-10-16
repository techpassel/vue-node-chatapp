import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type User from '@/models/UserModel'
import Axios from 'axios';

export const useUserStore = defineStore('user', () => {
    const user = ref<User>();
    const uploadPercentage = ref<number>(0);

    const signup = async (data: any) => {
        try {
            const res = await Axios.post('http://localhost:4000/user/auth',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    /*
                    //Following code is to monitor the uploded file data in percentage.
                    onUploadProgress: function (progressEvent_1: any) {
                        uploadPercentage.value = Math.round((progressEvent_1.loaded / progressEvent_1.total) * 100);
                    }
                    */
                }
            );
            user.value = res.data;
            return "Success";
        } catch (err: any) {
            console.log(err);
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

    const persistingUser = localStorage.getItem("user");
    if (persistingUser) {
        user.value = JSON.parse(persistingUser);
    }

    watch(user, val => {
        localStorage.setItem('user', JSON.stringify(val));
    }, { deep: true })

    return { user, signup, uploadPercentage }
})
