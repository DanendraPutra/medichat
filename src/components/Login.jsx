// components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email tidak valid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      // Simulasi login - cek user di localStorage
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        
        // Simulasi validasi sederhana
        // Di aplikasi nyata, ini akan dilakukan di backend
        localStorage.setItem('isLoggedIn', 'true');
        
        alert('Login berhasil!');
        navigate('/diagnosis'); // Redirect ke halaman diagnosis
      } else {
        setLoginError('Email belum terdaftar. Silakan daftar terlebih dahulu.');
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <section className="auth-section">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <h2 className="auth-title">Masuk ke MediChat</h2>
            <p className="auth-subtitle">Silakan masuk untuk melanjutkan</p>
            
            {loginError && (
              <div className="alert alert-error">
                {loginError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Masukkan email"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              
              <button type="submit" className="primary-btn auth-btn">
                Masuk
              </button>
            </form>
            
            <div className="auth-footer">
              <p>
                Belum punya akun?{' '}
                <Link to="/register" className="auth-link">
                  Daftar di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;