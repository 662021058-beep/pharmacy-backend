// src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Pill, Lock, User, LogIn, AlertCircle } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/api';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      
      if (response.data.success) {
        const { token, user } = response.data;
        // บันทึก Token และ ข้อมูล User ไว้ใน localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        onLoginSuccess(user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        {/* LOGO & TITLE */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={logoBoxStyle}>
            <Pill size={28} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '12px 0 4px 0' }}>
            LALITA PHARMA
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            ระบบควบคุมคลังยาและแจ้งเตือนสินค้าใกล้หมดอายุ
          </p>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div style={errorBoxStyle}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>ชื่อผู้ใช้งาน (Username)</label>
            <div style={inputContainerStyle}>
              <User size={16} color="#94a3b8" style={iconInsideStyle} />
              <input 
                type="text"
                placeholder="ระบุชื่อผู้ใช้งาน"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>รหัสผ่าน (Password)</label>
            <div style={inputContainerStyle}>
              <Lock size={16} color="#94a3b8" style={iconInsideStyle} />
              <input 
                type="password"
                placeholder="ระบุรหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={btnSubmitStyle}>
            {loading ? (
              'กำลังเข้าสู่ระบบ...'
            ) : (
              <>
                <LogIn size={16} /> เข้าสู่ระบบ
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            กรณีลืมรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบคลังหลัก
          </span>
        </div>

      </div>
    </div>
  );
}

// STYLES
const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#f8fafc',
  fontFamily: 'inherit'
};

const cardStyle = {
  width: '100%',
  maxWidth: '380px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '32px 28px',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
  border: '1px solid #e2e8f0'
};

const logoBoxStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  backgroundColor: '#0d9488',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '600',
  color: '#475569',
  marginBottom: '4px'
};

const inputContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

const iconInsideStyle = {
  position: 'absolute',
  left: '10px'
};

const inputStyle = {
  width: '100%',
  height: '38px',
  paddingLeft: '34px',
  paddingRight: '12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '12px',
  outline: 'none',
  boxSizing: 'border-box'
};

const btnSubmitStyle = {
  width: '100%',
  height: '40px',
  marginTop: '8px',
  backgroundColor: '#0d9488',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px'
};

const errorBoxStyle = {
  backgroundColor: '#ffe4e6',
  color: '#e11d48',
  padding: '8px 12px',
  borderRadius: '8px',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '16px'
};