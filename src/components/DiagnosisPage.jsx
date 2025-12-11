import React, { useState, useEffect } from 'react';
import '../Styles/DiagnosisPage.css'; 

const DiagnosisPage = ({ navigateTo }) => { 
  const [waktu, setWaktu] = useState('');

  // Logika untuk menentukan sapaan berdasarkan waktu (tidak berubah)
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    let sapaan = 'Siang'; 
    if (hour >= 5 && hour < 12) {
      sapaan = 'Pagi';
    } else if (hour >= 12 && hour < 18) {
      sapaan = 'Siang';
    } else if (hour >= 18 || hour < 5) {
      sapaan = 'Malam';
    }
    setWaktu(sapaan);
  }, []);

  // --- Komponen Header (DIPERBARUI) ---
  const DiagnosisHeader = ({ navigateTo }) => (
    <div className="diagnosis-header">
      
      {/* Container untuk Tombol Kembali dan Logo */}
      <div className="back-button-container">
        
        {/* Tombol Kembali Tanpa Border */}
        <button 
            className="back-button"
            onClick={() => navigateTo('home')}
            title="Kembali ke Beranda">
        </button>   
        
        {/* Logo MediChat */}
        <div className="diagnosis-logo">
          <div className="logo-text">
            <span style={{ color: '#2a5298', fontWeight: 'bold' }}>Medi</span>
            <span style={{ color: 'black' }}>Chat</span>
          </div>
        </div>
      </div>

      {/* Ikon User */}
      <div className="user-icon"></div>
    </div>
  );

  // --- Komponen Input Pesan (Tidak Berubah) ---
  const ChatInput = () => (
    <div className="chat-input-container">
      <div className="chat-message-box">
        Saya sudah dua hari batuk kering dan tenggorokan terasa gatal. Apakah ini gejala flu atau hal lain?
      </div>
      <div className="send-icon">
        &#9654;
      </div>
    </div>
  );

  return (
    <div className="diagnosis-page-wrapper">
      <div className="diagnosis-page">
        
        <DiagnosisHeader navigateTo={navigateTo} /> 

        <div className="diagnosis-content">
          <h2 className="greeting-text">
            Selamat ({waktu}), Keep Healthy
          </h2>
          <p className="subtitle-text">
            Cek Penyakitmu Sekarang
          </p>
          <div className="chat-area-placeholder"></div>
        </div>
        
        <ChatInput />
      <div className="new-chat-button-container">
            <button 
                className="new-chat-button"
                onClick={() => alert("Memulai Chat/Diagnosis Baru...")}
            >
                Mulai Chat Baru
            </button>
        </div>

      </div>
    </div>
  );
};

export default DiagnosisPage;