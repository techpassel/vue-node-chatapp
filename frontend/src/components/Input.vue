<script setup lang="ts">
import Img from '../assets/images/img.png'
import Attach from '../assets/images/attach.png'
</script>

<template>
    <div class="input">
        <input type="text" placeholder="Type something...">
        <div class="send">
            <img :src="Attach" alt="">
            <input type="file" id="upload">
            <label for="upload">
                <img :src="Img" alt="">
            </label>
            <button>Send</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import '@/assets/home.scss';
</style>