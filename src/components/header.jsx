// components/header.jsx (dengan logo kecil)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/images/logo.jpg';
import '../Styles.css';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status on component mount
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

  // Navigasi ke halaman diagnosa dengan konfirmasi login
  const handleDiagnosaClick = () => {
    console.log('Navigating to Diagnosis page...');
    
    if (!isLoggedIn) {
      const confirmLogin = window.confirm(
        'Untuk menggunakan layanan diagnosis, Anda perlu memiliki akun.\n\nApakah Anda sudah memiliki akun?\n\nKlik "OK" untuk Login\nKlik "Cancel" untuk Daftar Akun Baru'
      );
      
      if (confirmLogin) navigate('/login');
      else navigate('/register');

      return;
    }
    
    navigate('/diagnosis');
  };

  // Navigasi ke beranda
  const handleHomeClick = (e) => {
    e.preventDefault();
    console.log('Navigating to Home...');
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logout function
  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      navigate('/');
      alert('Anda telah berhasil logout.');
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">

          {/* Logo Kecil */}
          <div className="logo-container">
            <img 
              src={logoImage} 
              alt="MediChat Logo" 
              className="header-logo"
              onClick={() => navigate('/')}
              style={{ 
                cursor: 'pointer',
                width: '180px',
                height: 'auto'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/50x50/2a5298/ffffff?text=MC";
              }}
            />
          </div>

          {/* Bagian kanan header */}
          <div className="nav-right">
            
            <a 
              href="/"
              className="nav-link"
              onClick={handleHomeClick}
            >
              Home
            </a>
            
            <button 
              onClick={handleDiagnosaClick}
              className="primary-btn nav-diagnosa"
            >
              Diagnosa
            </button>

            {/* Jika sudah login → tampilkan ikon profil + logout */}
            {isLoggedIn && (
              <>
                {/* Ikon Profil */}
                <div 
                  className="profile-icon"
                  onClick={() => navigate('/profile')}
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    backgroundColor: "#2a5298",
                    cursor: "pointer",
                    marginRight: "10px"
                  }}
                ></div>

                {/* Tombol Logout */}
                <button 
                  onClick={handleLogout}
                  className="secondary-btn nav-logout"
                >
                  Logout
                </button>
              </>
            )}

          </div>

        </div> 
      </div>
    </header>
  );
};

export default Header;
