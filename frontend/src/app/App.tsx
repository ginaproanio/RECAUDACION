import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserData, Debt } from '../services/api';

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
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (user: UserData) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleImpersonate = (user: UserData) => {
    setCurrentUser(user);
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthScreen
              onLogin={handleLogin}
              onAdmin={() => window.location.href = '/admin'}
            />
          }
        />
        <Route
          path="/client"
          element={
            <ProtectedRoute isAuthenticated={!!currentUser}>
              {currentUser && (
                <ClientModule
                  user={currentUser}
                  debts={debts}
                  onPay={(ids: string[]) => {
                    setDebts(debts.map(d => ids.includes(d.id) ? { ...d, estado: 'pagado', paymentDate: new Date().toLocaleDateString() } : d));
                  }}
                  onLogout={handleLogout}
                  onUpdateUser={setCurrentUser}
                  onUploadDoc={(doc) => {
                    if (currentUser) {
                      setCurrentUser({ ...currentUser, documents: [...currentUser.documents, doc] });
                    }
                  }}
                />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminModule
              user={currentUser}
              onLogout={handleLogout}
              onImpersonate={handleImpersonate}
              onUpdateUser={setCurrentUser}
            />
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
