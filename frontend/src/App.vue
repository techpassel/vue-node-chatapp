<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import SocketioService from '@/services/socketio.service'
import { onBeforeUnmount } from 'vue';

SocketioService.setupSocketConnection();

onBeforeUnmount(() => {
  SocketioService.disconnect()
})

</script>

<template>
  <!-- <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav> -->
  <RouterView />
</template>


