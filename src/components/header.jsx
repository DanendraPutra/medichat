import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/images/logo.jpg';
import '../Styles.css';

const Header = ({ authStatus }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  // Ambil data user dari props
  const { isLoggedIn, user } = authStatus;
  
  // Ambil nama depan saja
  const getFirstName = (fullName) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  };

  const firstName = user ? getFirstName(user.name) : '';

  // Logic Navigasi Home (SPA - Tanpa Reload)
  const handleHomeClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logic Tombol Utama (Diagnosa / Profil)
  const handleMainButtonClick = () => {
    if (isLoggedIn) {
      // Jika sudah login, tombol ini membuka Popup Profil
      setShowProfile(true);
    } else {
      // Jika belum login, tombol ini arahkan ke login/register
      const confirmLogin = window.confirm(
        'Untuk melakukan diagnosa, Anda harus login terlebih dahulu.\nKlik OK untuk Login.'
      );
      if (confirmLogin) navigate('/login');
      else navigate('/register');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      // Kirim event agar App.js tahu state berubah
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

            {/* === KIRI: LOGO (180px) === */}
            <div className="logo-container">
              <img 
                src={logoImage} 
                alt="MediChat Logo" 
                className="header-logo"
                onClick={() => navigate('/')}
                style={{ 
                  width: '180px', 
                  height: 'auto', 
                  cursor: 'pointer' 
                }}
              />
            </div>

            {/* === KANAN: NAVIGASI === */}
            <div className="nav-right">
              
              {/* Link Home: Menggunakan span/div agar TIDAK reload halaman */}
              <div 
                className="nav-link"
                onClick={handleHomeClick}
                style={{ cursor: 'pointer' }}
              >
                Home
              </div>
              
              {/* TOMBOL UTAMA (Berubah sesuai status Login) */}
              <button 
                onClick={handleMainButtonClick}
                className="primary-btn nav-diagnosa"
                style={{ minWidth: '140px' }} // Agar nama panjang muat
              >
                {/* Logic Text: Jika Login tampilkan Nama, Jika tidak tampilkan Diagnosa */}
                {isLoggedIn ? `Hai, ${firstName}` : 'Diagnosa'}
              </button>

            </div> 
          </div>
        </div>
      </header>

      {/* === POPUP PROFIL === */}
      {showProfile && isLoggedIn && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowProfile(false)}>&times;</button>

            <div className="profile-layout">
              <div className="profile-left">
                {/* Avatar Placeholder */}
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