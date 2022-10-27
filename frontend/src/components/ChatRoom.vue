<script setup lang="ts">
import type { PropType } from 'vue';
import type ChatRoom from '../models/ChatRoomModel'

const props = defineProps({
    data: Object as PropType<ChatRoom>
})
const serverUrl = import.meta.env.VITE_BACKEND_ENDPOINT

</script>

<template>
    <div class="userChat">
        <img :src="serverUrl + '/image/' + data?.imageUrl" alt="" v-if="data?.imageUrl && data?.imageUrl != ''">
        <div class="groupNameIcon" v-else>{{ data?.name.charAt(0) }}</div>
        <div class="userChatInfo">
            <span class="roomName">{{ data?.name }}</span>
            <span class="msg">
                {{ data?.latestMsg && data?.latestMsg != '' ? data?.latestMsg : 'No message yet.' }}
            </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>