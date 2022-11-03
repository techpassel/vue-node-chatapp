<script lang="ts" setup>
import type Message from '@/models/MessageModel';
import type { PropType } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useMessageStore } from '@/stores/messageStore';
import { storeToRefs } from 'pinia';
import { dateInFormat } from '../utils/commonUtil';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const messageStore = useMessageStore();
const { currentRoomInfo } = storeToRefs(messageStore);
const serverUrl = import.meta.env.VITE_BACKEND_ENDPOINT;

const props = defineProps({
    data: Object as PropType<Message>
})

const getMsgUserImage = () => {
    if (props.data) {
        let msgUser = currentRoomInfo.value?.users.find(u => u.id == props.data?.userId);
        return msgUser?.imageUrl;
    } else {
        return null;
    }
}

</script>

<template>
    <!-- <div class="message">
        <div class="messageInfo">
            <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="">
            <span>Just now</span>
        </div>
        <div class="messageContent">
            <p>Hello</p>
        </div>
    </div>
    <div class="message owner">
        <div class="messageInfo">
            <img src="https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="">
            <span>Just now</span>
        </div>
        <div class="messageContent">
            <img src="https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="">
        </div>
    </div>
    <div class="message owner">
        <div class="messageInfo">
            <img src="https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="">
            <span>Just now</span>
        </div>
        <div class="messageContent">
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam quis possimus aut in eius officia
                voluptatum delectus facere esse alias, at voluptas, illum minima blanditiis aliquid? Non, dolorum?
                Explicabo, fuga!</p>
        </div>
    </div> -->
    <div :class="data?.userId == user?.id ? 'message owner' : 'message'" v-if="data">
        <div class="messageInfo">
            <img :src="serverUrl + '/image/' + getMsgUserImage()" alt="">
            <span>{{ dateInFormat(data.createdAt) }}</span>
        </div>
        <div class="messageContent">
            <p>{{ data?.message }}</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>