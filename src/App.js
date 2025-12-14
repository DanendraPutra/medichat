import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './Styles.css';
// PENTING: Baris ini diaktifkan kembali agar desain Login/Register muncul
import './Styles/auth.css'; 

import Header from './components/header'; 
import Features from './components/Features';
import Privacy from './components/Privacy';
import Footer from './components/footer';
import Hero from './components/hero';
import DiagnosisPage from './components/DiagnosisPage';
import Login from './components/Login';
import Register from './components/Register';

// Komponen untuk halaman utama
const HomePage = () => {
  const navigate = useNavigate();

  const navigateTo = (page) => {
    if (page === 'diagnosis') {
      navigate('/diagnosis');
    }
  };

  return (
    <>
      <Hero navigateTo={navigateTo} />
      <Features />
      <Privacy />
    </>
  );
};

// Komponen untuk halaman Login
const LoginPage = () => {
  return <Login />;
};

// Komponen untuk halaman Register
const RegisterPage = () => {
  return <Register />;
};

// Komponen untuk mengecek status login (Proteksi Route)
const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      setIsChecking(false);
    };

    checkAuth();
    
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isChecking) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Memuat...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Komponen Konten Utama
const AppContent = ({ authStatus }) => {
  const navigate = useNavigate();

  const navigateTo = (page) => {
    if (page === 'home') navigate('/');
    else if (page === 'diagnosis') navigate('/diagnosis');
    else if (page === 'login') navigate('/login');
    else if (page === 'register') navigate('/register');
  };

  return (
    <>
      {/* Mengirim props authStatus ke Header */}
      <Header authStatus={authStatus} />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/diagnosis" 
          element={
            <ProtectedRoute>
              <DiagnosisPage navigateTo={navigateTo} />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Footer />
    </>
  );
};

// --- App Utama ---
const App = () => {
  const [authStatus, setAuthStatus] = useState({
    isLoggedIn: false,
    user: null
  });

  const updateAuthStatus = () => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = localStorage.getItem('user');
    
    setAuthStatus({
      isLoggedIn: loggedIn,
      user: userData ? JSON.parse(userData) : null
    });
  };

  useEffect(() => {
    updateAuthStatus();
    
    const handleStorageChange = (e) => {
      if (!e.key || e.key === 'isLoggedIn' || e.key === 'user') {
        updateAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <AppContent authStatus={authStatus} />
      </div>
    </Router>
  );
};

export default App;