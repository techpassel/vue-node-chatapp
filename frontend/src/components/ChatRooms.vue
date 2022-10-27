<script setup lang="ts">
import { useMessageStore } from '../stores/messageStore';
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import ChatRoom from './ChatRoom.vue';

const userStore = useUserStore();
const messageStore = useMessageStore();
//For state and Getters(i.e. computed properties we need to use 'storeToRefs'  but not for actions)
const { user } = storeToRefs(userStore);
const { getUsersMessageGroups, setCurrentRoomId } = messageStore;
const { messageGroupsInFormat } = storeToRefs(messageStore);

onMounted(async () => {
    if (user.value) await getUsersMessageGroups();
})

const roomSelected = (roomId: string) => {
    setCurrentRoomId(roomId);
}

</script>

<template>
    <div class="chatRoom">
        <ChatRoom v-for="group of messageGroupsInFormat" :data="group" @click="roomSelected(group.id)" />
    </div>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>