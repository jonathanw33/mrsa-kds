import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import ModernNavigation from './components/ModernNavigation';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AnalysisPage from './pages/AnalysisPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// Context & Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './components/providers/theme-provider';
import PrivateRoute from './components/PrivateRoute';

function App() {
  // Initialize dark mode on app start
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.className = savedTheme;
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="mrsa-kds-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <ModernNavigation />
            <main className="container mx-auto px-4 py-6 min-h-[calc(100vh-8rem)]">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                
                <Route 
                  path="/analysis" 
                  element={
                    <PrivateRoute>
                      <AnalysisPage />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/results/:id" 
                  element={
                    <PrivateRoute>
                      <ResultsPage />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/history" 
                  element={
                    <PrivateRoute>
                      <HistoryPage />
                    </PrivateRoute>
                  } 
                />
                
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
