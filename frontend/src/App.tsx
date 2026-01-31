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
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            }
          />
          {/* Playground Demos */}
          <Route path="/demo" element={<ProtectedRoute><UXLanding /></ProtectedRoute>} />
          <Route path="/demo/wizard" element={<ProtectedRoute><WizardView /></ProtectedRoute>} />
          <Route path="/demo/matrix" element={<ProtectedRoute><MatrixView /></ProtectedRoute>} />
          <Route path="/demo/streamlined" element={<ProtectedRoute><StreamlinedView /></ProtectedRoute>} />
          <Route path="/demo/path" element={<ProtectedRoute><PathStreamlinedView /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
