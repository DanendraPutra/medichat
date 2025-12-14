import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'; // Tambah useLocation
import './Styles.css';
import './Styles/auth.css'; 

import Header from './components/header'; 
import Features from './components/Features';
import Privacy from './components/Privacy';
import Footer from './components/footer';
import Hero from './components/hero';
import DiagnosisPage from './components/DiagnosisPage';
import Login from './components/Login';
import Register from './components/Register';

// ... (HomePage, LoginPage, RegisterPage, ProtectedRoute TETAP SAMA) ...
// Copas saja bagian komponen-komponen kecil di atas dari kode sebelumnya jika tidak ada perubahan

const HomePage = () => {
  const navigate = useNavigate();
  const navigateTo = (page) => {
    if (page === 'diagnosis') navigate('/diagnosis');
  };
  return (
    <>
      <Hero navigateTo={navigateTo} />
      <Features />
      <Privacy />
    </>
  );
};

const LoginPage = () => <Login />;
const RegisterPage = () => <Register />;

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
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  if (isChecking) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

// --- APP CONTENT: DISINI PERBAIKANNYA ---
const AppContent = ({ authStatus, updateAuthStatus }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook untuk mendeteksi perubahan URL

  // Setiap kali URL berubah (location), cek ulang status login!
  useEffect(() => {
    updateAuthStatus();
  }, [location, updateAuthStatus]); 

  return (
    <>
      <Header authStatus={authStatus} />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/diagnosis" 
          element={
            <ProtectedRoute>
              <DiagnosisPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Footer />
    </>
  );
};

// --- APP UTAMA ---
const App = () => {
  const [authStatus, setAuthStatus] = useState({
    isLoggedIn: false,
    user: null
  });

  // Fungsi update status kita definisikan di sini agar stabil
  const updateAuthStatus = React.useCallback(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = localStorage.getItem('user');
    
    setAuthStatus({
      isLoggedIn: loggedIn,
      user: userData ? JSON.parse(userData) : null
    });
  }, []);

  useEffect(() => {
    updateAuthStatus();
    // Listener tambahan untuk storage event (antar tab)
    const handleStorageChange = () => updateAuthStatus();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [updateAuthStatus]);

  return (
    <Router>
      {/* Kirim fungsi updateAuthStatus ke bawah */}
      <AppContent authStatus={authStatus} updateAuthStatus={updateAuthStatus} />
    </Router>
  );
};

export default App;