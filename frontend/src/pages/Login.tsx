import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';

/**
 * 登录页：已改为 FX SSO 认证。
 * - 已登录用户直接跳转首页
 * - 未登录由 AuthContext 自动重定向到 SSO 登录页
 */
const Login: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>正在跳转到 SSO 登录…</p>
            </div>
        </div>
    );
};

export default Login;
