<script setup lang="ts">
import Sidebar from "../components/Sidebar.vue";
import Chat from "../components/Chat.vue";
</script>

<template>
  <div class="home">
    <div class="container">
      <Sidebar />
      <Chat />
    </div>
  </div>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>