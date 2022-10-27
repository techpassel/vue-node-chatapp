<script setup lang="ts">
import Cam from '../assets/images/cam.png';
import Add from '../assets/images/add.png';
import More from '../assets/images/more.png';
import Messages from './Messages.vue';
import Input from './Input.vue';
import { useMessageStore } from '@/stores/messageStore';
import { storeToRefs } from 'pinia';

const messageStore = useMessageStore();
const { currentRoomInfo } = storeToRefs(messageStore);
</script>

<template>
    <div class="chat">
        <div class="chatInfo">
            <span>{{ currentRoomInfo?.name }}</span>
            <div class="chatIcons">
                <img :src="Cam" alt="">
                <img :src="Add" alt="">
                <img :src="More" alt="">
            </div>
        </div>
        <Messages />
        <Input />
    </div>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>