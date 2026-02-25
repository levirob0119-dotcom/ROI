<script setup lang="ts">
/** 请求示例, 业务中请删除和替换此文件 */

import { ref } from 'vue';
import axios from 'axios';

defineProps<{}>();

const dataState = ref<string>();

async function tryRequest() {
  dataState.value = undefined;
  try {
    const response = await axios({
      method: 'get',
      /** 只是一个示例的服务 */
      url: 'https://request-proxy-dev.nioint.com/proxy/chatnio/common/v1/list_common_resource_model',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    console.log(response);
    dataState.value = JSON.stringify(response.data, null, 2);
  } catch (e) {
    console.error(e);
    dataState.value = `ERROR: ${e}`;
  }
}
</script>

<template>
  <div class="title">Hello. This is another page of /try .</div>
  <div>
    <button @click="tryRequest">Try Request</button>
  </div>
  <pre class="code">{{ dataState }}</pre>
</template>

<style scoped>
.title {
  font-size: 20px;
  text-align: center;
  margin: 40px;
}

.code {
  font-size: 12px;
  text-align: left;
  margin: 20px auto;
  width: 300px;
}
</style>
