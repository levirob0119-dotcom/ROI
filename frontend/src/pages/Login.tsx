import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth';
import { Loader2, ArrowRight } from 'lucide-react';
// import './Login.css'; // Removed

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await authService.login(username, password);
            login(response.token, response.user);
            // Navigation handled by useEffect
        } catch (err: any) {
            setError(err.response?.data?.error || '登录失败，请检查用户名和密码');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-[400px] bg-white rounded-lg shadow-xl border border-slate-200 p-10 animate-in slide-in-from-bottom-4 duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">ROI 分析工具</h1>
                    <p className="text-slate-500 text-sm">请登录以继续访问您的方案</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-6 animate-in fade-in duration-200">
                            {error}
                        </div>
                    )}

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-slate-900 mb-2">用户名</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150 disabled:opacity-50"
                            placeholder="输入您的用户名"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-slate-900 mb-2">密码</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150 disabled:opacity-50"
                            placeholder="输入您的密码"
                            disabled={isSubmitting}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 bg-blue-600 text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={16} />
                                正在登录...
                            </>
                        ) : (
                            <>
                                登录
                                <ArrowRight className="ml-2" size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-500">
                    <p>测试账号: demo / ROI_Demo_2026!</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
