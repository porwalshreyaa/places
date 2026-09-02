import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PublicPage from './pages/PublicPage';
import { LandingPage } from './pages/LandingPage';
import { AdminDashboard } from './modules/admin/AdminDashboard';
import { useAuth } from './context/AuthContext';

function AppRoutes() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center font-serif text-stone-500">Loading diary...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/admin" replace /> : <LandingPage />} 
      />
      <Route path="/login" element={user ? <Navigate to="/admin" replace /> : <LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/share/:username" element={<PublicPage />} />
      
      <Route 
        path="/dashboard" 
        element={
          user && user.role === 'ADMIN' ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/admin" replace />
          )
        } 
      />
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
