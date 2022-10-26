<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const { searchUser } = userStore;
const searchKey = ref<string>();

watch(searchKey, (newVal, oldVal) => {
    //We don't need oldVal here. I have left it just to show complete syntax.
    if (!newVal) newVal = '';
    searchUser(newVal);
}, {
    flush: 'post'
    // Setting flush: 'post' defer the watcher until after component rendering,
    //Here otherwise you will get 'searchUser' as undefined
})


</script>

<template>
    <div class="search">
        <div class="searchForm">
            <input type="text" placeholder="Find a user" v-model="searchKey">
        </div>
    </div>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>