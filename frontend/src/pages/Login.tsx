import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth';

type AuthMode = 'login' | 'register';

function getErrorMessage(error: unknown, mode: AuthMode) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const maybeResponse = (error as { response?: { data?: { error?: string } } }).response;
        if (maybeResponse?.data?.error) {
            return maybeResponse.data.error;
        }
    }
    return mode === 'register' ? '注册失败，请稍后重试。' : '登录失败，请检查用户名和密码。';
}

const Login: React.FC = () => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const isRegisterMode = mode === 'register';

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const cleanUsername = username.trim();
            const cleanPassword = password;

            if (!cleanUsername || !cleanPassword) {
                setError('用户名和密码不能为空');
                return;
            }

            if (isRegisterMode && cleanPassword.length < 6) {
                setError('密码长度不能少于 6 位');
                return;
            }

            const response = isRegisterMode
                ? await authService.register(cleanUsername, cleanPassword, cleanUsername)
                : await authService.login(cleanUsername, cleanPassword);
            login(response.token, response.user);
        } catch (error) {
            setError(getErrorMessage(error, mode));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="ds-page-bg flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-[420px] hover:translate-y-0">
                <CardHeader>
                    <CardTitle className="text-center text-ds-title text-text-primary">
                        {isRegisterMode ? 'ROI 分析工具注册' : 'ROI 分析工具登录'}
                    </CardTitle>
                    <p className="text-center text-ds-body-sm text-text-secondary">
                        {isRegisterMode ? '创建账号后即可开始使用，数据将按账号隔离。' : '登录后可继续管理项目并执行同屏联动测算。'}
                    </p>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error ? (
                            <div className="rounded-control border border-error/30 bg-error/10 px-3 py-2 text-ds-body-sm text-error">
                                {error}
                            </div>
                        ) : null}

                        <div className="space-y-2">
                            <label className="text-ds-body-sm font-semibold text-text-primary" htmlFor="login-username">
                                用户名
                            </label>
                            <Input
                                id="login-username"
                                type="text"
                                required
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="输入您的用户名"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-ds-body-sm font-semibold text-text-primary" htmlFor="login-password">
                                密码
                            </label>
                            <Input
                                id="login-password"
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="输入您的密码"
                                disabled={isSubmitting}
                            />
                        </div>

                        <Button type="submit" variant="action" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {isRegisterMode ? '注册中...' : '登录中...'}
                                </>
                            ) : (
                                <>
                                    {isRegisterMode ? '注册并登录' : '登录'}
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-5 text-center text-ds-caption text-text-secondary">
                        {isRegisterMode ? '已有账号？' : '还没有账号？'}
                        <button
                            type="button"
                            className="ml-1 text-primary hover:underline"
                            onClick={() => {
                                setMode((previous) => (previous === 'login' ? 'register' : 'login'));
                                setError('');
                            }}
                            disabled={isSubmitting}
                        >
                            {isRegisterMode ? '去登录' : '去注册'}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
