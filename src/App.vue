<script setup lang="ts">
import UserInfo from './components/UserInfo.vue';

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
  <user-info />
  <div class="content">
    <img alt="Vue logo" src="./assets/logo.png" />
    <div class="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/try">Try</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 40px;
  font-size: 32px;
}

.content {
  margin-top: 60px;
}
</style>
