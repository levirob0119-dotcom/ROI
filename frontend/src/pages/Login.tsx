import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth';
import { Loader2, ArrowRight } from 'lucide-react';
import './Login.css';

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
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="login-title">ROI 分析工具</h1>
                    <p className="login-subtitle">请登录以继续访问您的方案</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">用户名</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            placeholder="输入您的用户名"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">密码</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="输入您的密码"
                            disabled={isSubmitting}
                        />
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={16} style={{ marginRight: 8 }} />
                                正在登录...
                            </>
                        ) : (
                            <>
                                登录
                                <ArrowRight size={16} style={{ marginLeft: 8 }} />
                            </>
                        )}
                    </button>
                </form>

                <div className="test-account">
                    <p>测试账号: demo / ROI_Demo_2026!</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
