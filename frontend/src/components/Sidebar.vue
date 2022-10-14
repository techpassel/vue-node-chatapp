<script setup lang="ts">
import Navbar from "./Navbar.vue";
import Search from "./Search.vue";
import ChatRoom from "./ChatRoom.vue";

</script>

<template>
    <div class="sidebar">
        <Navbar />
        <Search />
        <ChatRoom />
        <div class="logoutBtn">
            <font-awesome-icon class="logoutIcon" icon="fa-solid fa-right-from-bracket" />
            <span>Logout</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>