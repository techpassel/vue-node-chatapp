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
const { currentRoomId } = storeToRefs(messageStore);

messageStore.$subscribe((mutation, state) => {
    //To clear text editor in case of room change.If "utation.events.newValue" returns currentRoomId
    //then it means current room is changed. As it return he updated value whatever is changed.
    //Ignore "red underline" on newValue as it is useless typescript error.
    if(mutation.events.newValue == currentRoomId.value){
        msg.value = '';
    }
})

const sendMsg = () => {
    isSending.value = true;
    if (currentRoomId.value) sendMessageInGroup(msg.value, currentRoomId.value, () => {
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