<script lang="ts" setup>
import type { PropType } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useMessageStore } from '@/stores/messageStore';
import { storeToRefs } from 'pinia';
import { dateInFormat } from '../utils/commonUtil';
import TempMessage from '@/models/TempMessageModel';
import type Message from '@/models/MessageModel';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const messageStore = useMessageStore();
const { currentRoomInfo } = storeToRefs(messageStore);
const serverUrl = import.meta.env.VITE_BACKEND_ENDPOINT;

const props = defineProps({
    data: Object as PropType<Message | TempMessage>
})

const getMsgUserImage = () => {
    if (props.data) {
        let msgUser = currentRoomInfo.value?.users.find(u => u.id == props.data?.userId);
        return msgUser?.imageUrl;
    } else {
        return null;
    }
}


const isTempMessage = () => {
    return props.data instanceof TempMessage;
}

</script>

<template>
    <div :class="data?.userId == user?.id ? 'message owner' : 'message'" v-if="!isTempMessage()">
        <div class="messageInfo">
            <img :src="serverUrl + '/image/' + getMsgUserImage()" alt="">
            <span>{{ dateInFormat(data?.createdAt) }}</span>
        </div>
        <div class="messageContent">
            <p>{{ data?.message }}</p>
        </div>
    </div>
    <div v-else>
        <div class="tempMessage">{{data?.message}}</div>
    </div>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>