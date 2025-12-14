import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/images/logo.jpg';
import '../Styles.css';

const Header = ({ authStatus }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const { isLoggedIn, user } = authStatus;
  
  const getFirstName = (fullName) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  };

  const firstName = user ? getFirstName(user.name) : '';

  // Navigasi Halaman
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logic Klik Diagnosa
  const handleDiagnosaClick = () => {
    if (isLoggedIn) {
      navigate('/diagnosis');
    } else {
      const confirmLogin = window.confirm(
        'Untuk melakukan diagnosa, Anda harus login terlebih dahulu.\nKlik OK untuk Login.'
      );
      if (confirmLogin) navigate('/login');
      else navigate('/register');
    }
  };

  // Logic Logout
  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('storage'));
      setShowProfile(false);
      navigate('/');
    }
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">

            {/* LOGO */}
            <div className="logo-container">
              <img 
                src={logoImage} 
                alt="MediChat Logo" 
                className="header-logo"
                onClick={() => navigate('/')}
                style={{ width: '180px', height: 'auto', cursor: 'pointer' }}
              />
            </div>

            {/* NAVIGASI KANAN */}
            <div className="nav-right">
              
              {/* 1. Menu HOME */}
              <div 
                className="nav-link"
                onClick={() => handleNavigation('/')}
                style={{ cursor: 'pointer' }}
              >
                Home
              </div>

              {/* 2. Menu DIAGNOSA (Akses ke Halaman DiagnosisPage) */}
              {/* Selalu muncul, tapi logic-nya ngecek login */}
              <div 
                 className="nav-link"
                 onClick={handleDiagnosaClick}
                 style={{ cursor: 'pointer', marginRight: '10px' }}
              >
                Diagnosa
              </div>
              
              {/* 3. TOMBOL PROFIL / LOGIN */}
              {/* Jika Login: Tampilkan Nama (Buka Popup) */}
              {/* Jika Belum: Tampilkan Tombol Masuk */}
              {isLoggedIn ? (
                <button 
                  onClick={() => setShowProfile(true)}
                  className="primary-btn"
                  style={{ 
                    minWidth: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'center',
                    padding: '0.6rem 1.5rem'
                  }}
                >
                  <div style={{
                    width: '20px', height: '20px', 
                    background: 'rgba(255,255,255,0.3)', borderRadius: '50%'
                  }}></div>
                  {firstName}
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="primary-btn nav-diagnosa"
                >
                  Masuk
                </button>
              )}

            </div> 
          </div>
        </div>
      </header>

      {/* POPUP PROFIL (SAMA SEPERTI SEBELUMNYA) */}
      {showProfile && isLoggedIn && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowProfile(false)}>&times;</button>

            <div className="profile-layout">
              <div className="profile-left">
                <div className="profile-avatar-large"></div>
              </div>

              <div className="profile-right">
                <div className="form-group">
                  <input type="text" className="modal-input" value={firstName} readOnly />
                  <span className="input-icon">✎</span>
                </div>
                <div className="form-group">
                  <input type="email" className="modal-input" value={user?.email || 'email@contoh.com'} readOnly />
                </div>
                <div className="action-buttons-row">
                  <button className="btn-outline">Ganti Password</button>
                  <button className="btn-outline">Edit Foto</button>
                </div>
                <div>
                  <button onClick={handleLogout} className="btn-danger">Keluar</button>
                </div>
              </div>
            </div>

            <div className="profile-bottom-section">
              <div className="setting-row">
                <span className="setting-label">Bahasa</span>
                <button className="btn-language">Indonesia</button>
              </div>
              <div className="setting-row">
                <span className="setting-label">Hapus Akun Selamanya</span>
                <button className="btn-danger" onClick={() => alert('Fitur segera hadir.')}>Hapus</button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Header;