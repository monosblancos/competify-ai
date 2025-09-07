import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Header from './componets/Header';
import ProtectedRoute from './componets/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import AnalisisCVPage from './pages/AnalisisCVPage';
import CVTextAnalysisPage from './pages/CVTextAnalysisPage';
import StandardsPage from './pages/StandardsPage';
import StandardDetailPage from './pages/StandardDetailPage';
import MyCoursesPage from './pages/MyCoursesPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  const location = useLocation();
  const showHeader = location.pathname !== '/' && location.pathname !== '/onboarding';

  return (
    <AuthProvider>
      <div className="bg-background min-h-screen font-sans">
        {showHeader && <Header />}
        <main className={showHeader ? "pt-16" : ""}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/analisis-cv" element={<AnalisisCVPage />} />
            <Route path="/analisis-cv-texto" element={<ProtectedRoute><CVTextAnalysisPage /></ProtectedRoute>} />
            <Route path="/estandares" element={<StandardsPage />} />
            <Route path="/estandares/:standardCode" element={<StandardDetailPage />} />
            <Route path="/mis-cursos" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
            <Route path="/oportunidades" element={<OpportunitiesPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;
