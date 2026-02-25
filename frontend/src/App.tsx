import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/useAuth';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import ProjectDetail from '@/pages/ProjectDetail';
import UV1000Workspace from '@/pages/UV1000Workspace';
import { Loader2 } from 'lucide-react';
import UXLanding from '@/pages/playground/UXLanding';
import WizardView from '@/pages/playground/WizardView';
import MatrixView from '@/pages/playground/MatrixView';
import StreamlinedView from '@/pages/playground/StreamlinedView';
import PathStreamlinedView from '@/pages/playground/PathStreamlinedView';
import ComponentShowcase from '@/pages/playground/ComponentShowcase';
import ComponentReviewShowcase from '@/pages/playground/ComponentReviewShowcase';
import { AppShell } from '@/components/layout/AppShell';
import WorkflowSettings from '@/pages/settings/WorkflowSettings';
import DesignSystemShowpage from '@/pages/design-system/DesignSystemShowpage';

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

const LegacyProjectRedirect = () => {
  const { id, projectId } = useParams<{ id?: string; projectId?: string }>();
  const resolvedProjectId = id || projectId;

  if (!resolvedProjectId) {
    return <Navigate to="/workspace" replace />;
  }

  return <Navigate to={`/workspace/${resolvedProjectId}/uva`} replace />;
};

function AuthenticatedAppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/workspace" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace"
          element={
            <ProtectedRoute>
              <AppShell>
                <Dashboard />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:projectId/uva"
          element={
            <ProtectedRoute>
              <AppShell>
                <ProjectDetail />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:projectId/uv1000"
          element={
            <ProtectedRoute>
              <AppShell>
                <UV1000Workspace />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:projectId"
          element={
            <ProtectedRoute>
              <LegacyProjectRedirect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <LegacyProjectRedirect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/workflow"
          element={
            <ProtectedRoute>
              <AppShell>
                <WorkflowSettings />
              </AppShell>
            </ProtectedRoute>
          }
        />
        {/* Playground Demos */}
        <Route path="/demo" element={<ProtectedRoute><UXLanding /></ProtectedRoute>} />
        <Route path="/demo/wizard" element={<ProtectedRoute><WizardView /></ProtectedRoute>} />
        <Route path="/demo/matrix" element={<ProtectedRoute><MatrixView /></ProtectedRoute>} />
        <Route path="/demo/streamlined" element={<ProtectedRoute><StreamlinedView /></ProtectedRoute>} />
        <Route path="/demo/path" element={<ProtectedRoute><PathStreamlinedView /></ProtectedRoute>} />
        <Route path="/components" element={<ProtectedRoute><AppShell><ComponentShowcase /></AppShell></ProtectedRoute>} />
        <Route path="/components/review" element={<ProtectedRoute><AppShell><ComponentReviewShowcase /></AppShell></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/design-system" element={<DesignSystemShowpage />} />
        <Route path="*" element={<AuthenticatedAppRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
