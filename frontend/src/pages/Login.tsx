import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth';

function getErrorMessage(error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const maybeResponse = (error as { response?: { data?: { error?: string } } }).response;
        if (maybeResponse?.data?.error) {
            return maybeResponse.data.error;
        }
    }
    return '登录失败，请检查用户名和密码。';
}

const Login: React.FC = () => {
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await authService.login(username, password);
            login(response.token, response.user);
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="ds-page-bg flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-[420px] hover:translate-y-0">
                <CardHeader>
                    <CardTitle className="text-center text-ds-title text-text-primary">ROI 分析工具登录</CardTitle>
                    <p className="text-center text-ds-body-sm text-text-secondary">登录后可继续管理项目并执行同屏联动测算。</p>
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
                                    登录中...
                                </>
                            ) : (
                                <>
                                    登录
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="mt-5 text-center text-ds-caption text-text-secondary">测试账号: demo / ROI_Demo_2026!</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
