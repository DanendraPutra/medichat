// components/hero.js (tanpa ikon roket)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    };
    
    checkAuth();
    
    // Listen for auth changes
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleStartDiagnosis = () => {
    if (!isLoggedIn) {
      // Tampilkan konfirmasi
      const confirmLogin = window.confirm(
        'Untuk menggunakan layanan diagnosis, Anda perlu memiliki akun.\n\nApakah Anda sudah memiliki akun?\n\nKlik "OK" untuk Login\nKlik "Cancel" untuk Daftar Akun Baru'
      );
      
      if (confirmLogin) {
        // User memilih Login
        navigate('/login');
      } else {
        // User memilih Daftar
        navigate('/register');
      }
      return;
    }
    
    // Jika sudah login, langsung arahkan ke diagnosis
    navigate('/diagnosis');
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Selamat Datang di MediChat</h1>
            <span className="hero-subtitle">Layanan kesehatan digital yang siap membantu Anda</span>
            
            {/* Tombol tanpa ikon roket */}
            <div className="hero-buttons-left">
              <button 
                onClick={handleStartDiagnosis} 
                className="primary-btn hero-diagnosis-btn"
              >
                Mulai Diagnosis
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;