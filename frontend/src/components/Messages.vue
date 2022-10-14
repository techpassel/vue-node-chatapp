<script setup lang="ts">
import Message from "./Message.vue";

</script>

<template>
    <div class="messages">
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
    </div>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>