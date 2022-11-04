<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import SocketioService from '@/services/socketio.service'
import { onBeforeUnmount, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

onMounted(() => {
  if (user) SocketioService.setupSocketConnection();
})

onBeforeUnmount(() => {
  if (user) SocketioService.disconnect()
})

</script>

<template>
  <!-- <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav> -->
  <RouterView />
</template>


