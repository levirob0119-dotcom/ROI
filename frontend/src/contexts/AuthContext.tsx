import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext, type SSOUser } from '@/contexts/auth-context';
import { setCurrentUser } from '@/services/local-db';

const PAGE_GATEWAY = import.meta.env.VITE_PAGE_GATEWAY_URL || 'https://page-gateway.nioint.com';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<SSOUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await fetch(`${PAGE_GATEWAY}/account/current`, {
                    credentials: 'include',
                });

                if (response.ok) {
                    const userData = await response.json();
                    // SSO response structure: { result_code, data: { user_name, display_name, ... } }
                    const d = userData.data || userData;
                    const ssoUser: SSOUser = {
                        username: d.user_name || d.username || d.domain_account || '',
                        displayName: d.display_name || d.displayName || d.nickName || d.user_name || '',
                    };
                    setCurrentUser(ssoUser.username); // 初始化 localStorage 用户隔离
                    setUser(ssoUser);
                } else {
                    // 未登录，跳转 SSO
                    window.location.href = `${PAGE_GATEWAY}/account/login?redirect_to=${encodeURIComponent(window.location.href)}`;
                }
            } catch (error) {
                console.error('SSO 认证失败:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const logout = () => {
        window.location.href = `${PAGE_GATEWAY}/account/login?redirect_to=${encodeURIComponent(window.location.origin)}`;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
