import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <a href="#home" className="footer-logo">MediChat</a>
          <p className="footer-tagline">
            MediChat dapat membantu kesehatan, meningkatkan kualitas hidup, 
            dan memberikan akses ke profesional medis terpercaya.
          </p>
          <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
            &copy; {new Date().getFullYear()} MediChat. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;