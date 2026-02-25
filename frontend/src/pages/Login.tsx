import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/useAuth';
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
        <div className="relative min-h-screen overflow-hidden bg-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(19,127,236,0.2),transparent_38%),radial-gradient(circle_at_85%_12%,rgba(14,165,233,0.14),transparent_36%)]" />

            <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="surface-panel hidden rounded-[24px] p-10 lg:block">
                    <p className="surface-tint-info inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                        ROI Workspace
                    </p>
                    <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-900">
                        更统一的组件库，
                        <br />
                        更可靠的测算体验。
                    </h1>
                    <p className="mt-4 max-w-lg text-ds-body-sm text-slate-600">
                        基于统一的表单、反馈与布局模式，减少视觉噪音，提升 UVA / UV1000 的录入和评审效率。
                    </p>

                    <div className="mt-8 space-y-3">
                        <div className="surface-panel-soft flex items-start gap-3 rounded-control px-4 py-3">
                            <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                            <div>
                                <p className="text-sm font-semibold text-slate-900">账号隔离与权限安全</p>
                                <p className="text-xs text-slate-500">项目数据按账号维度隔离，支持后续权限扩展。</p>
                            </div>
                        </div>
                        <div className="surface-panel-soft flex items-start gap-3 rounded-control px-4 py-3">
                            <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                            <div>
                                <p className="text-sm font-semibold text-slate-900">统一交互基线</p>
                                <p className="text-xs text-slate-500">表单、勾选、反馈组件共享同一视觉和状态规范。</p>
                            </div>
                        </div>
                    </div>
                </section>

                <Card className="w-full shadow-[0_20px_44px_rgba(15,23,42,0.1)]">
                    <CardHeader className="space-y-4">
                        <div className="space-y-2 text-center">
                            <CardTitle className="text-ds-title text-slate-900">
                                {isRegisterMode ? 'ROI 分析工具注册' : 'ROI 分析工具登录'}
                            </CardTitle>
                            <p className="text-ds-body-sm text-slate-600">
                                {isRegisterMode ? '创建账号后即可开始使用，数据将按账号隔离。' : '登录后可继续管理项目并执行同屏联动测算。'}
                            </p>
                        </div>

                        <div className="surface-inset grid grid-cols-2 gap-2 rounded-control p-1">
                            <Button
                                type="button"
                                variant={isRegisterMode ? 'ghost' : 'action'}
                                className="h-8"
                                onClick={() => {
                                    setMode('login');
                                    setError('');
                                }}
                                disabled={isSubmitting}
                            >
                                登录模式
                            </Button>
                            <Button
                                type="button"
                                variant={isRegisterMode ? 'action' : 'ghost'}
                                className="h-8"
                                onClick={() => {
                                    setMode('register');
                                    setError('');
                                }}
                                disabled={isSubmitting}
                            >
                                注册模式
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {error ? (
                                <div className="surface-tint-error rounded-control px-3 py-2 text-ds-body-sm text-error">
                                    {error}
                                </div>
                            ) : null}

                            <div className="space-y-2">
                                <Label htmlFor="login-username">用户名</Label>
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
                                <Label htmlFor="login-password">密码</Label>
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

                        <div className="text-center text-ds-caption text-slate-500">
                            {isRegisterMode ? '已有账号？' : '还没有账号？'}
                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="ml-1 h-auto px-0 py-0 text-ds-caption"
                                onClick={() => {
                                    setMode((previous) => (previous === 'login' ? 'register' : 'login'));
                                    setError('');
                                }}
                                disabled={isSubmitting}
                            >
                                {isRegisterMode ? '去登录' : '去注册'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
