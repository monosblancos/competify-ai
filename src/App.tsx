import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Header from './components/Header';
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
import DiagnosticoPage from './pages/DiagnosticoPage';
import ProgramasPage from './pages/ProgramasPage';
import ChatbotExploracionPage from './pages/ChatbotExploracionPage';
import ResourcesPage from './pages/ResourcesPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import MyLibraryPage from './pages/MyLibraryPage';

const App: React.FC = () => {
  const location = useLocation();
  const hideHeaderPaths = ['/login', '/register'];
  const showHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <AuthProvider>
      <div className="bg-background min-h-screen font-sans">
        {showHeader && <Header />}
        <main className={showHeader ? "pt-28" : ""}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/diagnostico" element={<DiagnosticoPage />} />
            <Route path="/diagnostico/chatbot" element={<ChatbotExploracionPage />} />
            <Route path="/programas" element={<ProgramasPage />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/analisis-cv" element={<AnalisisCVPage />} />
            <Route path="/analisis-cv-texto" element={<ProtectedRoute><CVTextAnalysisPage /></ProtectedRoute>} />
            <Route path="/estandares" element={<StandardsPage />} />
            <Route path="/estandares/:standardCode" element={<StandardDetailPage />} />
            <Route path="/mis-cursos" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
            <Route path="/oportunidades" element={<OpportunitiesPage />} />
            <Route path="/recursos" element={<ResourcesPage />} />
            <Route path="/recursos/:slug" element={<ResourceDetailPage />} />
            <Route path="/mi-biblioteca" element={<ProtectedRoute><MyLibraryPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;
