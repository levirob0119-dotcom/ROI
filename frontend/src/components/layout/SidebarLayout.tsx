
// import { cn } from "@/lib/utils"; // Removed


interface SidebarLayoutProps {
    children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-white text-slate-900 font-sans">
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
}
