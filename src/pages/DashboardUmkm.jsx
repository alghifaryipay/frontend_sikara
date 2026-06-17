import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UmkmLayout from '../components/UmkmLayout';

const DashboardUmkm = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ stats: { totalProduk: 0, totalPenjualan: 0, totalTransaksi: 0 }, orders: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUserId = localStorage.getItem('userId');

        if (!savedUserId || savedUserId === 'undefined' || savedUserId === 'null') {
            console.log("UserId belum siap, mengalihkan ke halaman login...");
            navigate('/login');
            return;
        }

        fetch(`http://localhost:5000/api/umkm/dashboard-full/${savedUserId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Gagal mengambil data dari server');
                return res.json();
            })
            .then((resData) => {
                setData(resData);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Gagal parse JSON atau koneksi error:", err);
                setLoading(false);
            });
    }, [navigate]);

    if (loading) return <div className="p-10 text-center text-xs text-gray-400 animate-pulse">Memuat dashboard toko Anda...</div>;

    return (
        <UmkmLayout>
            <div className="space-y-6 w-full">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Toko Saya</h1>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">Kelola produk dan lacak penjualan Anda</p>
                </div>

                {/* 3 CARD STATISTIK ATAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Total Produk (SVG) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Total Produk</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{data.stats.totalProduk}</h3>
                            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">+2 minggu ini</span>
                        </div>
                    </div>

                    {/* Card 2: Total Penjualan (SVG) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.854-1.106-2.24 0-3.093 1.124-.865 2.946-.865 4.07 0l.385.296M12 3v3m0 15v3" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Total Penjualan</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">Rp {parseFloat(data.stats.totalPenjualan).toLocaleString('id-ID')}</h3>
                            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">+15% bulan ini</span>
                        </div>
                    </div>

                    {/* Card 3: Transaksi Terbaru (SVG) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Transaksi Terbaru</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{data.stats.totalTransaksi}</h3>
                            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">+8 hari ini</span>
                        </div>
                    </div>
                </div>

                {/* BOTTOM GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Transaksi Terbaru */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-800 text-sm">Transaksi Terbaru</h3>
                        <div className="divide-y divide-slate-50">
                            {data.orders.length === 0 ? (
                                <p className="text-xs text-gray-400 py-4 text-center">Belum ada transaksi penjualan masuk.</p>
                            ) : (
                                data.orders.slice(0, 4).map((order, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-800">{order.product_name}</h4>
                                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Jumlah: {order.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <h4 className="text-xs font-bold text-slate-800">Rp {parseFloat(order.total).toLocaleString('id-ID')}</h4>
                                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">{order.jam_lalu || 'Baru saja'}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sektor Tombol Aksi Cepat (MURNI SVG) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 h-fit">
                        <h3 className="font-bold text-slate-800 text-sm">Aksi Cepat</h3>
                        <div className="space-y-2.5">
                            <button onClick={() => navigate('/umkm/produk')} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-100">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Tambah ...
                            </button>
                            <button onClick={() => navigate('/umkm/laporan')} className="w-full bg-blue-50/50 hover:bg-blue-50 text-blue-600 text-xs font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                                Lihat Semua Transaksi
                            </button>
                            <button onClick={() => navigate('/umkm/laporan')} className="w-full bg-blue-50/50 hover:bg-blue-50 text-blue-600 text-xs font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                                </svg>
                                Lihat Laporan Penjualan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </UmkmLayout>
    );
};

export default DashboardUmkm;