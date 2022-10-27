<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const serverUrl = import.meta.env.VITE_BACKEND_ENDPOINT
</script>

<template>
    <div class="navbar">
        <div class="logo">
            Ennaman Chat
        </div>
        <div class="user">
            <img :src="serverUrl + '/image/' + user?.imageUrl" alt="Profile image">
            <span>{{user?.name}}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>