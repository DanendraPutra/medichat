import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/images/logo.jpg';
import '../Styles.css';

const Header = ({ authStatus }) => {
  const navigate = useNavigate();
  
  // State untuk Popup
  const [showProfile, setShowProfile] = useState(false);
  
  // State untuk Edit Nama
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');

  // Ambil data user dari props
  const { isLoggedIn, user } = authStatus;

  // Mengisi nama sementara saat popup dibuka/user berubah
  useEffect(() => {
    if (user && user.name) {
      setTempName(user.name);
    }
  }, [user]);

  // Helper: Ambil nama depan untuk tombol navbar
  const getFirstName = (fullName) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  };
  const firstName = user ? getFirstName(user.name) : '';

  // --- LOGIKA UTAMA ---

  // 1. Simpan Nama Baru
  const handleSaveName = () => {
    if (!tempName.trim()) {
      alert("Nama tidak boleh kosong!");
      return;
    }

    // Ambil data user lama, update namanya, simpan balik ke LocalStorage
    const updatedUser = { ...user, name: tempName };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Matikan mode edit
    setIsEditing(false);
    
    // Beritahu App.js agar tampilan terupdate otomatis
    window.dispatchEvent(new Event('storage'));
    alert("Nama berhasil diubah!");
  };

  // 2. Hapus Akun Selamanya
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "PERINGATAN: Apakah Anda yakin ingin menghapus akun selamanya?\nData Anda akan hilang dan tidak bisa dikembalikan."
    );

    if (confirmDelete) {
      // Hapus semua data
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      
      // Update sistem
      window.dispatchEvent(new Event('storage'));
      setShowProfile(false);
      navigate('/');
      alert("Akun Anda telah dihapus.");
    }
  };

  // 3. Logout (Hanya keluar sesi)
  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('isLoggedIn');
      window.dispatchEvent(new Event('storage'));
      setShowProfile(false);
      navigate('/');
    }
  };

  // 4. Navigasi
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDiagnosaClick = () => {
    if (isLoggedIn) navigate('/diagnosis');
    else {
      if (window.confirm('Anda perlu login untuk diagnosa. Login sekarang?')) {
        navigate('/login');
      } else {
        navigate('/register');
      }
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
              <div 
                className="nav-link"
                onClick={() => handleNavigation('/')}
                style={{ cursor: 'pointer' }}
              >
                Home
              </div>

              <div 
                 className="nav-link"
                 onClick={handleDiagnosaClick}
                 style={{ cursor: 'pointer', marginRight: '10px' }}
              >
                Diagnosa
              </div>
              
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

      {/* --- POPUP PROFIL FULL FEATURE --- */}
      {showProfile && isLoggedIn && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowProfile(false)}>&times;</button>

            <div className="profile-layout">
              {/* Bagian Foto */}
              <div className="profile-left">
                <div className="profile-avatar-large"></div>
              </div>

              {/* Bagian Form Edit */}
              <div className="profile-right">
                
                {/* Input Nama (Bisa Diedit) */}
                <div className="form-group">
                  <input 
                    type="text" 
                    className="modal-input" 
                    value={isEditing ? tempName : user.name} 
                    onChange={(e) => setTempName(e.target.value)}
                    readOnly={!isEditing} 
                    style={{
                      borderColor: isEditing ? '#2a5298' : '#e0e0e0',
                      backgroundColor: isEditing ? '#fff' : '#f9f9f9'
                    }}
                  />
                  
                  {/* Ikon: Jika sedang edit muncul Ceklis, jika tidak muncul Pensil */}
                  {isEditing ? (
                    <span 
                      className="input-icon" 
                      onClick={handleSaveName}
                      style={{ color: 'green', fontWeight: 'bold', fontSize: '1.2rem' }}
                      title="Simpan Nama"
                    >
                      ✓
                    </span>
                  ) : (
                    <span 
                      className="input-icon" 
                      onClick={() => setIsEditing(true)}
                      title="Edit Nama"
                    >
                      ✎
                    </span>
                  )}
                </div>

                {/* Input Email (Tetap Readonly) */}
                <div className="form-group">
                  <input 
                    type="email" 
                    className="modal-input" 
                    value={user?.email || 'email@contoh.com'} 
                    readOnly 
                    style={{ backgroundColor: '#f9f9f9' }}
                  />
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
              
              {/* TOMBOL HAPUS AKUN (Berfungsi) */}
              <div className="setting-row">
                <span className="setting-label">Hapus Akun Selamanya</span>
                <button 
                  className="btn-danger" 
                  onClick={handleDeleteAccount}
                >
                  Hapus
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Header;