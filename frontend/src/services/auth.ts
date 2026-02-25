// SSO 认证通过 FX 平台 Cookie 自动处理，AuthContext 负责初始化
// 此文件保留供后续扩展使用
export const authService = {
    getCurrentUser: async () => {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (!response.ok) throw new Error('未登录');
        return response.json();
    },
};
