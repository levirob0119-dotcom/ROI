import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

import { loginViteMiddleware } from '@nio-fe/nio-def-core';
import mkcert from 'vite-plugin-mkcert';

const envConfigs = {
  /** 设定对应环境  */
  env: 'dev',
  region: 'cn',
};

/** 说明 https://nio.feishu.cn/docx/VCUld3VQbohZ4cxtJmacSjG0nTb */
const viteLoginPlugin = () => ({
  name: 'vite-login-server',
  configureServer(server) {
    const { env, region } = envConfigs;
    const loginFunc = loginViteMiddleware({
      env: env,
      region: region,
      mode: 'remote',
      isNeedLogin: (req) => {
        return !req.url?.endsWith('.map') && req.headers['sec-fetch-dest'] !== 'script';
      },
    });
    server.middlewares.use(loginFunc);
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? process.env.FX_CDN_PUBLIC_PATH : '/',
  experimental: {
    renderBuiltUrl(filename, type) {
      return {
        relative: true,
      };
    },
  },

  server: {
    https: true,
    host: 'myapp.nioint.com',
  },

  plugins: [vue(), vueJsx(), viteLoginPlugin(), mkcert({
    source: 'coding'
  })],
});
