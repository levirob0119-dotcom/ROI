import { ChevronDown, LogOut, Plus, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';


interface SidebarLayoutProps {
    children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isDashboard = location.pathname === '/';
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement | null>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!userMenuRef.current) return;
            if (userMenuRef.current.contains(event.target as Node)) return;
            setIsUserMenuOpen(false);
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white text-slate-900 font-sans">
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
                <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-sm sm:px-6">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
                        <div className="flex items-baseline gap-3">
                            <div className="text-xl font-semibold tracking-tight text-slate-900">PD - UV 工具</div>
                            {isDashboard ? <span className="text-base font-medium text-slate-700">工作台</span> : null}
                        </div>
                        <div className="flex items-center gap-3">
                            {isDashboard ? (
                                <Button
                                    type="button"
                                    variant="action"
                                    onClick={() => window.dispatchEvent(new Event('dashboard:create-project'))}
                                >
                                    <Plus className="h-4 w-4" />
                                    新建项目
                                </Button>
                            ) : null}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-control border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                                    onClick={() => setIsUserMenuOpen((previous) => !previous)}
                                >
                                    <User className="h-4 w-4" />
                                    <span>{user?.username || '用户'}</span>
                                    <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                                </button>

                                {isUserMenuOpen ? (
                                    <div className="absolute right-0 top-[calc(100%+8px)] min-w-[148px] rounded-card border border-slate-200 bg-white p-1.5 shadow-[0_10px_22px_rgba(15,23,42,0.12)]">
                                        <button
                                            type="button"
                                            className="flex w-full items-center gap-2 rounded-control px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            退出登录
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
}
