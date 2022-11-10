<script setup lang="ts">
import Message from "./Message.vue";
import { useMessageStore } from "@/stores/messageStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const messageStore = useMessageStore();
const { messages } = storeToRefs(messageStore);

const messageRef = ref();
let previousScrollTop: number = 0;

const scrollToBottom = () => {
    let el: any = messageRef.value;
    if (el) {
        if (previousScrollTop == 0 || (previousScrollTop - el.scrollTop) < 200) {
            el.scrollTop = el.scrollHeight;
            previousScrollTop = el.scrollTop;
        }
    }
}

messageStore.$subscribe((mutation, state) => {
    setTimeout(() => {
        scrollToBottom();
    }, 100);
})
</script>

<!--We can use following syntax also along with above one at the same time-->
<!-- <script lang="ts">
export default {
    methods: {
        scrollToBottom() {
            let el: any = this.$refs.messageRef;
            console.log(el);
            
            if (el) {
                el.scrollTop = el.scrollHeight;
            }
        }
    },

    mounted() {
        setTimeout(() => {
            this.scrollToBottom();
        }, 400);
    }
}
</script> -->

<template>
    <div class="messages" ref="messageRef">
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