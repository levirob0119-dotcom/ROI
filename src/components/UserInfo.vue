<script setup lang="ts">
/** 请求示例, 业务中请删除和替换此文件 */

import { onMounted, ref } from 'vue';
import axios from 'axios';

defineProps();

const userName = ref<string>();
const userEmail = ref<string>();

async function loadUserName() {
  userName.value = undefined;
  try {
    const response = await axios({
      method: 'get',
      /** 只是一个示例的服务 */
      url: 'https://page-gateway-dev.nioint.com/account/current',
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    console.log(response);
    userName.value = response.data.data.userName;
    userEmail.value = response.data.data.email;
  } catch (e) {
    console.error(e);
    userName.value = `ERROR: ${e}`;
  }
}

onMounted(() => {
  loadUserName();
});
</script>

<template>
  <div class="user-bar">
    <span></span>
    <span>
      Logged in as:
      <span class="user">{{ userName || '-' }}</span>
      ({{ userEmail || '-' }})
    </span>
  </div>
</template>

<style scoped>
.user-bar {
  display: flex;
  justify-content: space-between;
}

.user {
  font-weight: bold;
}
</style>
