import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { BuildingIcon, BoxIcon, CheckIcon } from '../components/Icons';

const DashboardAdmin = () => {
    const [stats, setStats] = useState({ totalUMKM: 0, totalProduk: 0, umkmAktif: 0 });
    const [umkmList, setUmkmList] = useState([]);
    const [umkmKategori, setUmkmKategori] = useState([]); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            fetch('https://backend-sikara.onrender.com/api/admin/dashboard').then((res) => {
                if (!res.ok) throw new Error('Gagal muat data dashboard');
                return res.json();
            }),
            fetch('https://backend-sikara.onrender.com/api/admin/laporan').then((res) => {
                if (!res.ok) throw new Error('Gagal muat data laporan');
                return res.json();
            })
        ])
        .then(([dashData, reportData]) => {
            setStats(dashData.stats);
            setUmkmList(dashData.umkmList);
            setUmkmKategori(reportData.umkmKategori || []);
            setLoading(false);
        })
        .catch((err) => {
            console.error('Error fetching dashboard admin data:', err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <p className="text-sm font-medium text-purple-600 animate-pulse">Menghubungkan data real-time database SIKaRa...</p>
                </div>
            </AdminLayout>
        );
    }

    // 🎨 Peta Warna Terstandarisasi agar Kontras dan Indah
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#a855f7', '#ec4899', '#64748b'];

    // 🧮 Algoritma Akurat Akumulasi Derajat Lingkaran (0% - 100%)
    let cumulativePercent = 0;
    const conicGradientString = umkmKategori.length > 0
        ? umkmKategori.map((kat, index) => {
            const start = cumulativePercent;
            cumulativePercent += parseFloat(kat.percent);
            return `${colors[index % colors.length]} ${start}% ${cumulativePercent}%`;
          }).join(', ')
        : '#e2e8f0 0% 100%';

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* HEADER JUDUL */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Monitoring UMKM</h1>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Pantau data pendaftaran UMKM dan produk secara real-time</p>
                </div>

                {/* 3 KARTU STATISTIK ATAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                            <BuildingIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Total UMKM</p>
                            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.totalUMKM}</h3>
                            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">+3 bulan ini</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <BoxIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Total Produk</p>
                            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.totalProduk}</h3>
                            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">+12 minggu ini</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <CheckIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">UMKM Aktif</p>
                            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.umkmAktif}</h3>
                            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">
                                Tingkat aktif {stats.totalUMKM > 0 ? ((stats.umkmAktif / stats.totalUMKM) * 100).toFixed(1) : 0}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* GRAFIK & PIE CHART GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tren Pertumbuhan */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
                        <h4 className="font-bold text-slate-800 text-sm mb-6">Pertumbuhan UMKM</h4>
                        <div className="h-48 flex items-end justify-between border-b border-l border-slate-100 px-4 pb-2 relative">
                            <div className="absolute inset-x-0 bottom-12 border-t border-dashed border-slate-100 w-full"></div>
                            <div className="absolute inset-x-0 bottom-24 border-t border-dashed border-slate-100 w-full"></div>
                            <div className="text-center w-1/4 text-[10px] text-gray-400 font-medium">Jan<div className="h-2 w-2 bg-purple-500 rounded-full mx-auto -mt-16 border-2 border-white shadow-sm"></div></div>
                            <div className="text-center w-1/4 text-[10px] text-gray-400 font-medium">Feb<div className="h-2 w-2 bg-purple-500 rounded-full mx-auto -mt-20 border-2 border-white shadow-sm"></div></div>
                            <div className="text-center w-1/4 text-[10px] text-gray-400 font-medium">Mar<div className="h-2 w-2 bg-purple-500 rounded-full mx-auto -mt-24 border-2 border-white shadow-sm"></div></div>
                            <div className="text-center w-1/4 text-[10px] text-gray-400 font-medium">Apr<div style={{ marginBottom: `${Math.min(stats.totalUMKM * 10, 120)}px` }} className="h-2.5 w-2.5 bg-purple-600 rounded-full mx-auto border-2 border-white shadow transition-all duration-1000"></div></div>
                        </div>
                    </div>

                    {/* 🔥 PERBAIKAN TOTAL BOX DIAGRAM LINGKARAN */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                        <h4 className="font-bold text-slate-800 text-sm mb-2">UMKM Berdasarkan Kategori</h4>
                        
                        {/* Bulatan Diagram Menggunakan Conic Gradient Dinamis Murni */}
                        <div className="flex justify-center my-4">
                            <div 
                                className="w-32 h-32 rounded-full shadow-inner transition-all duration-500"
                                style={{ background: `conic-gradient(${conicGradientString})` }}
                            ></div>
                        </div>

                        {/* LEGENDA DENGAN ANGKA PERSENTASE REAL DATABASE */}
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 font-medium pt-3 border-t border-slate-100">
                            {umkmKategori.length === 0 ? (
                                <p className="col-span-2 text-center text-gray-400">Belum ada kategori data.</p>
                            ) : (
                                umkmKategori.map((item, index) => (
                                    <div key={index} className="flex items-center gap-1.5 truncate">
                                        <span 
                                            className="w-2.5 h-2.5 rounded-md inline-block flex-shrink-0" 
                                            style={{ backgroundColor: colors[index % colors.length] }}
                                        ></span>
                                        <span className="truncate">{item.name} ({item.percent}%)</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* TABEL DAFTAR UMKM TERDAFTAR */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50">
                        <h4 className="font-bold text-slate-800 text-sm">Daftar UMKM Terdaftar</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-gray-400 uppercase">
                                    <th className="p-4 pl-8">Nama Usaha</th>
                                    <th className="p-4">Pemilik</th>
                                    <th className="p-4">Lokasi</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs text-slate-600 divide-y divide-slate-50 font-medium">
                                {umkmList.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-400">Belum ada data usaha terdaftar di database.</td>
                                    </tr>
                                ) : (
                                    umkmList.map((item, index) => (
                                        <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                                            <td className="p-4 pl-8 flex items-center gap-3 font-semibold text-slate-800">
                                                <div className="w-7 h-7 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center">
                                                    <BuildingIcon className="w-4 h-4 text-purple-500" />
                                                </div>
                                                {item.business_name}
                                            </td>
                                            <td className="p-4 text-gray-500 flex items-center gap-1.5 pt-5">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                                </svg>
                                                {item.owner_name}
                                            </td>
                                            <td className="p-4 text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-gray-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1 1 15 0Z" />
                                                    </svg>
                                                    {item.location}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => navigate('/admin/umkm')} className="text-purple-600 hover:underline font-bold text-[11px]">Lihat Detail</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default DashboardAdmin;