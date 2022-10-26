<script setup lang="ts">
import Navbar from "./Navbar.vue";
import Search from "./Search.vue";
import ChatRooms from "./ChatRooms.vue";
import { useUserStore } from '../stores/userStore'

const { logout } = useUserStore();

</script>

<template>
    <div class="sidebar">
        <Navbar />
        <Search />
        <ChatRooms />
        <div class="logoutBtn" @click="logout">
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