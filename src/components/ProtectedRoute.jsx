import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  
  // 1. Ambil role dan amankan langsung menjadi huruf kecil semua
  const rawRole = localStorage.getItem('role');
  const userRole = rawRole ? rawRole.toLowerCase().trim() : null;

  // Validasi Token Sesi Rusak/Kosong
  if (!token || token === 'undefined' || token === 'null') {
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // 2. Jika ada batasan role, bersihkan daftar allowedRoles ke huruf kecil semua
  if (allowedRoles) {
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase().trim());

    // Cek apakah role user saat ini diizinkan
    if (!normalizedAllowedRoles.includes(userRole)) {
      alert('Anda tidak memiliki hak akses untuk masuk ke halaman ini!');
      

      localStorage.clear();
      sessionStorage.clear();
      return <Navigate to="/login" replace />;
    }
  }

  // Jika semua verifikasi aman, loloskan ke halaman tujuan
  return children;
};

export default ProtectedRoute;