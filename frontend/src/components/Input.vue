<script setup lang="ts">
import Img from '../assets/images/img.png';
import Attach from '../assets/images/attach.png';
import { ref } from 'vue';
import { useMessageStore } from '@/stores/messageStore';
import { storeToRefs } from 'pinia';
import { sendMessageInGroup } from '../services/chatHelper.service'

const msg = ref<string>('');
const isSending = ref<boolean>(false);
const messageStore = useMessageStore();
const { currentRoomInfo } = storeToRefs(messageStore);

const sendMsg = () => {
    isSending.value = true;
    if (currentRoomInfo.value?.id) sendMessageInGroup(msg.value, currentRoomInfo.value?.id, () => {
        msg.value = ''
        isSending.value = false;
    });
}

</script>

<template>
    <form class="input" @submit.prevent="sendMsg">
        <input type="text" v-model="msg" placeholder="Type something...">
        <div class="send">
            <img :src="Attach" alt="">
            <input type="file" id="upload">
            <label for="upload">
                <img :src="Img" alt="">
            </label>
            <button type="submit" :disabled="isSending">{{ isSending ? 'Sending...' : 'Send' }}</button>
        </div>
    </form>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>