import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // 携带 SSO Cookie，后端 authMiddleware 依赖此 Cookie
});

// 响应拦截器：401 不再自动跳转，SSO 登录由 AuthContext 统一管理
// 避免 SSO 已认证但后端 authMiddleware 暂时不可用时产生无限循环跳转
api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
