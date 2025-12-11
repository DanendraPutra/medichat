// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

// Komponen untuk mengecek status login
const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek status login dari localStorage
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      setIsChecking(false);
    };

    checkAuth();
    
    // Tambahkan event listener untuk perubahan localStorage
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isChecking) {
    // Tampilkan loading spinner atau skeleton
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memeriksa autentikasi...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Redirect ke halaman login jika belum login
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Komponen konten utama dengan routing
const AppContent = () => {
  const navigate = useNavigate();

  const navigateTo = (page) => {
    if (page === 'home') {
      navigate('/');
    } else if (page === 'diagnosis') {
      navigate('/diagnosis');
    } else if (page === 'login') {
      navigate('/login');
    } else if (page === 'register') {
      navigate('/register');
    }
  };

  return (
    <>
      <Header navigateTo={navigateTo} />
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
        {/* Redirect untuk path yang tidak dikenal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
};

// Komponen App utama
const App = () => {
  const [authStatus, setAuthStatus] = useState({
    isLoggedIn: false,
    user: null
  });

  // Fungsi untuk update status auth di seluruh app
  const updateAuthStatus = () => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = localStorage.getItem('user');
    
    setAuthStatus({
      isLoggedIn: loggedIn,
      user: userData ? JSON.parse(userData) : null
    });
  };

  // Listen to auth changes
  useEffect(() => {
    updateAuthStatus();
    
    const handleStorageChange = (e) => {
      if (e.key === 'isLoggedIn' || e.key === 'user') {
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
        {/* Kirim authStatus sebagai context jika diperlukan */}
        <AppContent />
      </div>
    </Router>
  );
};

export default App;