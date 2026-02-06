import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Lazy load components for better performance
const AuthScreen = lazy(() => import('./components/AuthScreen'));
const AdminModule = lazy(() => import('./components/AdminModule'));
const ClientModule = lazy(() => import('./components/ClientModule'));

// Loading component
const LoadingSpinner = () => (
  <div className="h-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366]"></div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) => {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// --- APP ROOT ---
export default function App() {
  const { user, logout, isLoading } = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthScreen
              onLogin={() => {}} // AuthScreen handles login internally via useAuth
              onAdmin={() => window.location.href = '/admin'}
            />
          }
        />
        <Route
          path="/client"
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              {user && (
                <ClientModule
                  user={user}
                  debts={[]} // ClientModule will use useDebts hook internally
                  onPay={() => {}} // Not needed anymore
                  onLogout={logout}
                  onUpdateUser={() => {}} // TODO: Implement user update
                  onUploadDoc={() => {}} // TODO: Implement document upload
                />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminModule
              user={user}
              onLogout={logout}
              onImpersonate={() => {}} // TODO: Implement impersonation
              onUpdateUser={() => {}} // TODO: Implement user update
            />
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
