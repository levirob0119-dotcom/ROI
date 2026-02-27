import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // 携带 SSO Cookie，后端 authMiddleware 依赖此 Cookie
});

// 响应拦截器：处理 401（未登录或 SSO 会话过期）
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 使用 BASE_URL 前缀，避免跳转到 F[x] 平台的 /login
            const base = import.meta.env.BASE_URL || '/';
            window.location.href = `${base}login`;
        }
        return Promise.reject(error);
    }
);

export default api;
