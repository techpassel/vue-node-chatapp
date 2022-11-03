<script setup lang="ts">
import Message from "./Message.vue";
import { useMessageStore } from "@/stores/messageStore";
import { storeToRefs } from "pinia";

const messageStore = useMessageStore();
const { messages } = storeToRefs(messageStore);
</script>

<template>
    <div class="messages">
        <div v-if="messages.length > 0">
            <Message v-for="message of messages" :data="message" />
        </div>
        <div v-else>
            <div class="emptyGroupMessage">No messages yet.</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>