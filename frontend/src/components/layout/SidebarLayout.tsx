import { ChevronDown, LogOut, Plus, User } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';


interface SidebarLayoutProps {
    children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isDashboard = location.pathname === '/';
    const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);

    const handleLogout = () => {
        setIsAccountDialogOpen(false);
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-100 text-slate-900 font-sans">
            {/* Main Content Area */}
            <main className="relative flex h-full flex-1 flex-col overflow-hidden">
                <header className="surface-panel-soft surface-divider-bottom sticky top-0 z-20 px-4 py-3 sm:px-6">
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
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="gap-1.5 px-2.5 py-1.5 text-slate-700 hover:bg-slate-50"
                                onClick={() => setIsAccountDialogOpen(true)}
                            >
                                <User className="h-4 w-4" />
                                <span>{user?.username || '用户'}</span>
                                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                            </Button>

                            <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
                                <DialogContent className="max-w-sm">
                                    <DialogHeader>
                                        <DialogTitle className="inline-flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            账号操作
                                        </DialogTitle>
                                        <DialogDescription>
                                            当前账号：{user?.username || '用户'}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsAccountDialogOpen(false)}
                                        >
                                            取消
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            退出登录
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
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
