import { ChevronDown, LogOut, Pin, PinOff, Plus, User, Wrench } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/contexts/useAuth';
import { cn } from '@/lib/utils';
import { projectService } from '@/services/projects';
import type { Project } from '@/types/models';

interface AppShellProps {
  children: React.ReactNode;
}

type ToolType = 'uva' | 'uv1000';

const TOOL_ITEMS: Array<{ id: ToolType; label: string }> = [
  { id: 'uva', label: 'UVA' },
  { id: 'uv1000', label: 'UV1000' },
];

const T2_PIN_STORAGE_KEY = 'layout.t2.pinned';

function parseWorkspaceContext(pathname: string): { projectId: string | null; tool: ToolType | null } {
  const match = pathname.match(/^\/workspace\/([^/]+)\/(uva|uv1000)$/i);
  if (!match) return { projectId: null, tool: null };

  return {
    projectId: decodeURIComponent(match[1]),
    tool: match[2].toLowerCase() as ToolType,
  };
}

export function AppShell({ children }: AppShellProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [t2PeekOpen, setT2PeekOpen] = useState(false);
  const [t2Pinned, setT2Pinned] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(T2_PIN_STORAGE_KEY) === 'true';
  });

  const { projectId: activeProjectId, tool: activeTool } = useMemo(
    () => parseWorkspaceContext(pathname),
    [pathname]
  );

  const showToolRail = Boolean(activeProjectId);

  useEffect(() => {
    let active = true;

    const loadProjects = async () => {
      try {
        const data = await projectService.getAll();
        if (active) {
          setProjects(data);
        }
      } catch (error) {
        console.error('Failed to load projects in AppShell', error);
      }
    };

    void loadProjects();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleProjectsChanged = () => {
      void (async () => {
        try {
          const data = await projectService.getAll();
          setProjects(data);
        } catch (error) {
          console.error('Failed to refresh projects in AppShell', error);
        }
      })();
    };

    window.addEventListener('projects:changed', handleProjectsChanged);
    return () => window.removeEventListener('projects:changed', handleProjectsChanged);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(T2_PIN_STORAGE_KEY, String(t2Pinned));
  }, [t2Pinned]);

  const handleLogout = () => {
    setIsAccountDialogOpen(false);
    logout();
    navigate('/login');
  };

  const handleCreateProject = () => {
    if (pathname !== '/workspace') {
      navigate('/workspace');
      window.setTimeout(() => window.dispatchEvent(new Event('dashboard:create-project')), 0);
      return;
    }
    window.dispatchEvent(new Event('dashboard:create-project'));
  };

  const handleProjectChange = (projectId: string) => {
    if (!projectId) {
      navigate('/workspace');
      return;
    }
    navigate(`/workspace/${projectId}/${activeTool || 'uva'}`);
  };

  const handleToolChange = (tool: ToolType) => {
    if (!activeProjectId) return;
    navigate(`/workspace/${activeProjectId}/${tool}`);
  };

  const activeProjectExists = projects.some((project) => project.id === activeProjectId);
  const projectSelectValue = activeProjectExists ? activeProjectId || '' : '';

  return (
    <div className="grid h-screen w-full grid-rows-[72px_minmax(0,1fr)] overflow-hidden text-slate-900">
      <header className="surface-panel-soft surface-divider-bottom z-20 px-4 py-3 sm:px-6">
        <div className="mx-auto flex h-full w-full max-w-[1720px] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-4">
            <div className="inline-flex items-center gap-2 px-1">
              <span className="truncate text-lg font-semibold tracking-tight text-slate-900">PD - UV 工具</span>
            </div>
            <div className="hidden w-[140px] sm:block">
              <Select
                value="default"
                onValueChange={() => undefined}
                options={[{ label: '默认工作区', value: 'default' }]}
                aria-label="工作区切换"
              />
            </div>
            <div className="w-[220px]">
              <Select
                value={projectSelectValue}
                onValueChange={handleProjectChange}
                placeholder="选择项目"
                options={projects.map((project) => ({ label: project.name, value: project.id }))}
                aria-label="项目切换"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="action" onClick={handleCreateProject}>
              <Plus className="h-4 w-4" />
              新建项目
            </Button>
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
          </div>
        </div>
      </header>

      <div
        className={cn(
          'relative grid min-h-0',
          showToolRail && t2Pinned && 'grid-cols-[248px_minmax(0,1fr)]',
          showToolRail && !t2Pinned && 'grid-cols-[12px_minmax(0,1fr)]',
          !showToolRail && 'grid-cols-[minmax(0,1fr)]'
        )}
      >
        {showToolRail && t2Pinned ? (
          <aside className="surface-panel-soft surface-divider-right p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tools</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setT2Pinned(false)}
                title="取消固定工具栏"
              >
                <PinOff className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1.5">
              {TOOL_ITEMS.map((tool) => (
                <Button
                  key={tool.id}
                  type="button"
                  variant={activeTool === tool.id ? 'action' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => handleToolChange(tool.id)}
                >
                  <Wrench className="h-4 w-4" />
                  {tool.label}
                </Button>
              ))}
            </div>
          </aside>
        ) : null}

        {showToolRail && !t2Pinned ? (
          <>
            <div
              className="surface-panel-soft surface-divider-right relative"
              onMouseEnter={() => setT2PeekOpen(true)}
              aria-label="工具栏触发区"
            />
            <aside
              className={cn(
                'surface-panel surface-divider-right absolute bottom-0 left-0 top-0 z-10 w-[248px] p-4 shadow-[0_18px_34px_rgba(15,23,42,0.18)] transition-transform duration-200',
                showToolRail && t2PeekOpen ? 'translate-x-0' : '-translate-x-full'
              )}
              onMouseLeave={() => setT2PeekOpen(false)}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tools</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    setT2Pinned(true);
                    setT2PeekOpen(false);
                  }}
                  title="固定工具栏"
                >
                  <Pin className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1.5">
                {TOOL_ITEMS.map((tool) => (
                  <Button
                    key={tool.id}
                    type="button"
                    variant={activeTool === tool.id ? 'action' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => handleToolChange(tool.id)}
                  >
                    <Wrench className="h-4 w-4" />
                    {tool.label}
                  </Button>
                ))}
              </div>
            </aside>
          </>
        ) : null}

        <main className="min-h-0 overflow-y-auto no-scrollbar">{children}</main>
      </div>

      <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="inline-flex items-center gap-2">
              <User className="h-4 w-4" />
              账号操作
            </DialogTitle>
            <DialogDescription>当前账号：{user?.username || '用户'}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAccountDialogOpen(false)}>
              取消
            </Button>
            <Button type="button" variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              退出登录
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
