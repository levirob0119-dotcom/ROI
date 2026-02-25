# FX Page 项目模版(Vue 3 + TypeScript + Vite)

包含功能:

- SSO 基础配置(当前模版重点), 默认调用 dev 环境请求的示例
- 引用 CDN 资源的基础配置
- 默认添加 vue-router

SSO 相关操作步骤:

- 选一个开发域名, 比如 `myapp.nioint.com` (HTTPS 域名由 Vite 插件自动处理)
- 在 `/etc/hosts` 指定 DNS 配置 `127.0.0.1 myapp.nioint.com`
- 在 `vite.config.js` 当中指定域名 `myapp.nioint.com`
- 运行 `npm run dev` 再启动 https://myapp.nioint.com:5173/#/
