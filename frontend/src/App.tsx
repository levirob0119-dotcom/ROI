import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import ProjectDetail from '@/pages/ProjectDetail';
import { Loader2 } from 'lucide-react';
import UXLanding from '@/pages/playground/UXLanding';
import WizardView from '@/pages/playground/WizardView';
import MatrixView from '@/pages/playground/MatrixView';
import StreamlinedView from '@/pages/playground/StreamlinedView';
import PathStreamlinedView from '@/pages/playground/PathStreamlinedView';
import ComponentShowcase from '@/pages/playground/ComponentShowcase';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import WorkflowSettings from '@/pages/settings/WorkflowSettings';

// 保护路由组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {/* 暂时保留原Dashboard，后续重构移除Navbar */}
                <SidebarLayout>
                  <Dashboard />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <SidebarLayout>
                  <ProjectDetail />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/workflow"
            element={
              <ProtectedRoute>
                <SidebarLayout>
                  <WorkflowSettings />
                </SidebarLayout>
              </ProtectedRoute>
            }
          />
          {/* Playground Demos */}
          <Route path="/demo" element={<ProtectedRoute><UXLanding /></ProtectedRoute>} />
          <Route path="/demo/wizard" element={<ProtectedRoute><WizardView /></ProtectedRoute>} />
          <Route path="/demo/matrix" element={<ProtectedRoute><MatrixView /></ProtectedRoute>} />
          <Route path="/demo/streamlined" element={<ProtectedRoute><StreamlinedView /></ProtectedRoute>} />
          <Route path="/demo/path" element={<ProtectedRoute><PathStreamlinedView /></ProtectedRoute>} />
          <Route path="/components" element={<ProtectedRoute><SidebarLayout><ComponentShowcase /></SidebarLayout></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
