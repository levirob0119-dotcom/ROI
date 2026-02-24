import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { BarChart3, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <div className="brand-logo">
                    <BarChart3 />
                </div>
                <span className="brand-text">ROI 分析工具</span>
            </Link>

            <div className="ml-8 hidden md:block">
                <Link to="/demo" className="text-gray-600 hover:text-indigo-600 font-medium text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
                    ✨ UX 体验场
                </Link>
            </div>

            <div className="navbar-user">
                {user && (
                    <div className="user-info">
                        <div className="user-avatar">
                            {getInitials(user.displayName || user.username)}
                        </div>
                        <span className="user-name">{user.displayName || user.username}</span>
                    </div>
                )}
                <button onClick={handleLogout} className="btn-logout" title="退出登录">
                    <LogOut size={16} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
