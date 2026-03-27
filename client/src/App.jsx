// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/common/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GroupsList from './components/groups/GroupsList';
import CreateGroup from './components/groups/CreateGroup';
import GroupDetails from './components/groups/GroupDetails';
import CreateExpense from './components/expenses/CreateExpense';
import { LanguageProvider } from './contexts/languageContext';

import { useAuthStore } from './stores/authStore';

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  const isRehydrated = useAuthStore((s) => s.isRehydrated);

  if (!isRehydrated) return <div>Loading...</div>;
  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  const isRehydrated = useAuthStore((s) => s.isRehydrated);

  if (!isRehydrated) return <div>Loading...</div>;
  return !token ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
              <Route path="/groups" element={<ProtectedRoute><Layout><GroupsList /></Layout></ProtectedRoute>} />
              <Route path="/groups/create" element={<ProtectedRoute><Layout><CreateGroup /></Layout></ProtectedRoute>} />
              <Route path="/expenses/create" element={<ProtectedRoute><Layout><CreateExpense /></Layout></ProtectedRoute>} />
              <Route path="/groups/:id" element={<ProtectedRoute><Layout><GroupDetails /></Layout></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div>
                    <h1>404 - Page Not Found</h1>
                    <a href="/dashboard">Go to Dashboard</a>
                  </div>
                </div>
              } />
            </Routes>

            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          </div>
        </Router>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
