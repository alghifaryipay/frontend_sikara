import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminIcon, UmkmIcon, UserIcon } from '../components/Icons';

const Register = () => {
    // State untuk menyimpan data form
    const [role, setRole] = useState('pengguna'); // Default: Pengguna biasa
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State tambahan khusus untuk Pemilik UMKM
    const [businessName, setBusinessName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('Makanan & Minuman');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Satukan data yang akan dikirim ke backend
        const payload = {
            role,
            name,
            email,
            password,
            ...(role === 'umkm' && {
                business_name: businessName,
                phone,
                location,
                category
            })
        };

        try {
            const response = await fetch('https://backend-sikara.onrender.com/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registrasi Berhasil! Silakan Masuk.');
                // Nanti jika sudah ada halaman login, kita arahkan ke: navigate('/login')
            } else {
                alert(data.message || 'Registrasi Gagal');
            }
        } catch (error) {
            console.error('Error saat register:', error);
            alert('Gagal terhubung ke server backend.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
            {/* Mini Navbar Atas */}
            <header className="bg-white border-b border-gray-100 p-4 px-8 flex justify-between items-center shadow-sm">
                {/* Ganti teks lama dengan tag img */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <img
                        src="/logo1.png" // Ambil langsung dari folder public
                        alt="Logo SIKaRa"
                        className="h-8 w-auto object-contain" // Tailwind untuk mengatur tinggi agar rapi
                    />
                    <span className="font-bold text-xl text-slate-800 ">SIKaRa</span>
                </div>
                <button onClick={() => navigate('/login')} className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-xs px-4 py-2 rounded-xl transition-colors">
                    Masuk
                </button>
            </header>

            {/* Main Form Content */}
            <main className="flex-1 flex items-center justify-center p-6 my-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transition-all">
                    <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-1">Buat Akun</h2>
                    <p className="text-xs text-gray-400 text-center mb-6">Bergabung dengan SIKaRa</p>

                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Tipe Akun / Role Selector Card */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Tipe Akun</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('pengguna')}
                                    className={`p-3 border rounded-xl flex flex-col items-center gap-1 transition-all ${role === 'pengguna'
                                        ? 'border-blue-500 bg-blue-50 text-blue-600 ring-4 ring-blue-50 font-semibold'
                                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <UserIcon className="w-8 text-inherit" />
                                    <span className="text-xs">Pengguna</span>
                                    <span className="text-[10px] text-gray-400 font-normal">Belanja produk</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setRole('umkm')}
                                    className={`p-3 border rounded-xl flex flex-col items-center gap-1 transition-all ${role === 'umkm'
                                        ? 'border-blue-500 bg-blue-50 text-blue-600 ring-4 ring-blue-50 font-semibold'
                                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <UmkmIcon className="w-8 text-inherit" />
                                    <span className="text-xs">Pemilik UMKM</span>
                                    <span className="text-[10px] text-gray-400 font-normal">Jual produk</span>
                                </button>
                            </div>
                        </div>

                        {/* Input Umum (Selalu Muncul) */}
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                placeholder="Nama Anda"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                required
                            />
                        </div>

                        {/* INPUT DINAMIS: Hanya muncul jika memilih Pemilik UMKM */}
                        {role === 'umkm' && (
                            <div className="space-y-4 animate-fadeIn">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1">Nama Usaha</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Warung Sari"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1">Nomor Telepon</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: +62 812-3456-7890"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1">Lokasi Usaha</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Jl. Rancah No.10"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1">Kategori UMKM</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                    >
                                        <option value="Makanan & Minuman">Makanan & Minuman</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Kerajinan">Kerajinan</option>
                                        <option value="Ritel">Ritel</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Input Kredensial Akun (Selalu Muncul) */}
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
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-colors shadow-md shadow-blue-100 text-sm mt-4"
                        >
                            Daftar Sekarang
                        </button>
                    </form>

                    <p className="text-xs text-center text-gray-500 mt-4">
                        Sudah punya akun? <span onClick={() => navigate('/login')} className="text-blue-500 font-medium cursor-pointer hover:underline">Masuk di sini</span>
                    </p>
                </div>
            </main>

            <footer className="text-center p-4 text-xs text-gray-400 bg-white border-t border-gray-100">
                &copy; 2026 SIKaRa Rancah. All rights reserved.
            </footer>
        </div>
    );
};

export default Register;