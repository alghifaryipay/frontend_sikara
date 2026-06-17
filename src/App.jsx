import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import DataUmkm from './pages/DataUmkm';
import DataProduk from './pages/DataProduk';
import Laporan from './pages/Laporan';

// IMPORT HALAMAN MITRA UMKM BARU
import DashboardUmkm from './pages/DashboardUmkm';
import UmkmProduk from './pages/UmkmProduk';
import UmkmLaporan from './pages/UmkmLaporan';
import ProtectedRoute from './components/ProtectedRoute';
import UmkmKasir from './pages/UmkmKasir';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* PANEL ADMIN PROTECTED */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/admin/umkm" element={<ProtectedRoute allowedRoles={['admin']}><DataUmkm /></ProtectedRoute>} />
        <Route path="/admin/produk" element={<ProtectedRoute allowedRoles={['admin']}><DataProduk /></ProtectedRoute>} />
        <Route path="/admin/laporan" element={<ProtectedRoute allowedRoles={['admin']}><Laporan /></ProtectedRoute>} />

        {/* PANEL MITRA UMKM PROTECTED (SEMUA DIKUNCI AMAN) */}
        <Route path="/umkm/dashboard" element={<ProtectedRoute allowedRoles={['umkm']}><DashboardUmkm /></ProtectedRoute>} />
        <Route path="/umkm/produk" element={<ProtectedRoute allowedRoles={['umkm']}><UmkmProduk /></ProtectedRoute>} />
        <Route path="/umkm/laporan" element={<ProtectedRoute allowedRoles={['umkm']}><UmkmLaporan /></ProtectedRoute>} />
        <Route path="/umkm/kasir" element={<ProtectedRoute allowedRoles={['umkm']}><UmkmKasir /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;