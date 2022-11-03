<script setup lang="ts">
import type { PropType } from 'vue';
import type ChatRoom from '../models/ChatRoomModel'
import { useMessageStore } from '@/stores/messageStore';
import { storeToRefs } from 'pinia';

const props = defineProps({
    data: Object as PropType<ChatRoom>
})
const serverUrl = import.meta.env.VITE_BACKEND_ENDPOINT

const messageStore = useMessageStore();
const { currentRoomInfo } = storeToRefs(messageStore);

</script>

<template>
    <div :class="currentRoomInfo?.id == data?.id ? 'userChat activeChat': 'userChat'">
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