<script setup lang="ts">
import type { PropType } from 'vue';
import type ChatRoom from '../models/ChatRoomModel'

const props = defineProps({
    data: Object as PropType<ChatRoom>
})

</script>

<template>
    <div class="userChat">
        <img src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="">
        <div class="userChatInfo">
            <span class="roomName">{{ data?.name }}</span>
            <!-- <span class="msg">{{ data?.latestMsg ? data?.latestMsg : 'No message yet.' }}</span> -->
            <span>{{data?.id}}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>