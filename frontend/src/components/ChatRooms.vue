<script setup lang="ts">
import { useMessageStore } from '../stores/messageStore';
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import ChatRoom from './ChatRoom.vue';
import MessageGroup from '@/models/MessageGroup';

const userStore = useUserStore();
const messageStore = useMessageStore();
//For state and Getters(i.e. computed properties we need to use 'storeToRefs'  but not for actions)
const { user } = storeToRefs(userStore);
const { getUsersMessageGroups } = messageStore;
const { messageGroups } = storeToRefs(messageStore);

onMounted(async () => {
    if (user.value) await getUsersMessageGroups(user.value.id);
})

const getGroupDataAsProps = (group: any) => {
    let data = new MessageGroup();
    data.id = group.id;
    data.isMultiUserGroup = group.isMultiUserGroup;
    if (group.isMultiUserGroup) {
        data.name = group.name;
        data.imageUrl = group.groupImageUrl;
    } else {
        let otherUser = group.users.find((u: any) => u.id != user.value?.id)
        data.name = otherUser.name;
        data.imageUrl = otherUser.imageUrl;
    }
    data.latestMsg = group.latestMsg;
    return data;
}
</script>

<template>
    <div class="chatRoom">
        <ChatRoom v-for="group of messageGroups" :data="getGroupDataAsProps(group)" />
    </div>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>