import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminIcon, UmkmIcon, UserIcon } from '../components/Icons';

const Login = () => {
    const [role, setRole] = useState('pengguna'); // Default role: Pengguna
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // ========================================================
    // LOGIKA ANTI-LOOP: Cek Sesi Otomatis & Bersihkan Data Rusak
    // ========================================================
    useEffect(() => {
        const token = localStorage.getItem('token');
        const rawRole = localStorage.getItem('role');
        const userRole = rawRole ? rawRole.toLowerCase().trim() : null;
        const userId = localStorage.getItem('userId');

        if (token && userRole && userId && userId !== 'undefined' && userId !== 'null') {
            if (userRole === 'admin') {
                navigate('/admin/dashboard');
            } else if (userRole === 'umkm') {
                navigate('/umkm/dashboard');
            }
        } else {
            localStorage.clear();
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://backend-sikara.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // 1. Bersihkan sisa data lama terlebih dahulu
                localStorage.clear();
                sessionStorage.clear();

                // 2. Kunci penulisan role ke huruf kecil agar sinkron dengan ProtectedRoute dan App.jsx
                const finalRole = (data.role || role || '').toLowerCase().trim();

                // 3. Simpan data baru dari database secara tegas
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', finalRole); 
                localStorage.setItem('userId', String(data.user?.id || '')); 
                localStorage.setItem('name', data.user?.name || data.name || ''); 
                localStorage.setItem('email', data.user?.email || data.email || '');
                
                // 🔥 PERBAIKAN: TAMBAHKAN PENYIMPANAN LOGO DAN NAMA USAHA!
                localStorage.setItem('logoUrl', data.user?.logo_url || '/logo1.png');
                localStorage.setItem('businessName', data.user?.name || ''); // Default ke nama pemilik jika nama usaha belum diambil

                alert('Login Berhasil!');

                // 4. Validasi sinkronisasi sebelum pengalihan halaman
                const checkId = localStorage.getItem('userId');

                if (checkId && checkId !== 'undefined' && checkId !== 'null') {
                    if (finalRole === 'admin') {
                        navigate('/admin/dashboard');
                    } else if (finalRole === 'umkm') {
                        navigate('/umkm/dashboard');
                    } else {
                        navigate('/');
                    }
                } else {
                    alert('Gagal menyinkronkan sesi ID ke browser. Silakan coba lagi.');
                }
            } else {
                alert(data.message || 'Login Gagal, periksa email dan kata sandi Anda.');
            }
        } catch (error) {
            console.error('Error saat login:', error);
            alert('Gagal terhubung ke server backend.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
            {/* Mini Navbar Atas */}
            <header className="bg-white border-b border-gray-100 p-4 px-8 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <img
                        src="/logo1.png"
                        alt="Logo SIKaRa"
                        className="h-9 w-auto object-contain"
                    />
                    <span className="font-bold text-xl text-slate-800 ">SIKaRa</span>
                </div>
                <button onClick={() => navigate('/register')} className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-xs px-4 py-2 rounded-xl transition-colors">
                    Daftar
                </button>
            </header>

            {/* Main Login Form Container */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                    <div className="flex justify-center mb-2">
                        <img
                            src="/logo1.png"
                            alt="Logo SIKaRa"
                            className="h-20 w-auto object-contain"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">Selamat Datang Kembali</h2>
                    <p className="text-xs text-gray-400 text-center mb-6">Masuk ke akun Anda</p>

                    {/* Role Selector Box */}
                    <div className="mb-5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Masuk sebagai</label>
                        <div className="grid grid-cols-3 gap-2.5">
                            {[
                                { id: 'admin', label: 'Admin', IconComponent: AdminIcon },
                                { id: 'umkm', label: 'Pemilik UMKM', IconComponent: UmkmIcon },
                                { id: 'pengguna', label: 'Pengguna', IconComponent: UserIcon }
                            ].map((item) => {
                                const Icon = item.IconComponent;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setRole(item.id)}
                                        className={`p-2.5 border rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${role === item.id
                                            ? 'border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-100 font-semibold'
                                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 text-inherit" />
                                        <span className="text-[11px] whitespace-nowrap">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Alamat Email</label>
                            <input
                                type="email"
                                placeholder="email@anda.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Kata Sandi</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-colors shadow-md shadow-blue-100 text-sm mt-2"
                        >
                            Masuk
                        </button>
                    </form>

                    <p className="text-slate-500 text-xs text-center mt-5">
                        Belum punya akun?{' '}
                        <span onClick={() => navigate('/register')} className="text-blue-500 font-medium cursor-pointer hover:underline">
                            Daftar di sini
                        </span>
                    </p>
                </div>
            </main>

            <footer className="text-center p-4 text-xs text-gray-400 bg-white border-t border-gray-100">
                &copy; 2026 SIKaRa Rancah. All rights reserved.
            </footer>
        </div>
    );
};

export default Login;