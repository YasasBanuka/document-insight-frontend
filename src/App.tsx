import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ChatPage } from './pages/ChatPage';
import { SearchPage } from './pages/SearchPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import { ProfilePage } from './pages/ProfilePage';
// import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function AppContent() {
  const { isAuthenticated } = useAuth();

  // Enable global keyboard shortcuts
  // useKeyboardShortcuts();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        
        {/* Public routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/documents" /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/documents" /> : <RegisterPage />} 
        />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />

        <Route path="/documents" element={
          <ProtectedRoute>
            <DocumentsPage />
          </ProtectedRoute>
        } />

        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />

        <Route path="/search" element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

      </Routes>
      {isAuthenticated && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

export default App;