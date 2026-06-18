import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UmkmLayout from '../components/UmkmLayout';

const UmkmLaporan = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [data, setData] = useState({ stats: { totalProduk: 0, totalPenjualan: 0, totalTransaksi: 0 }, orders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetch(`https://backend-sikara.onrender.com/api/umkm/dashboard-full/${userId}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading report:", err);
        setLoading(false);
      });
  }, [userId, navigate]);

  if (loading) {
    return (
      <UmkmLayout>
        <div className="p-10 text-center text-xs text-gray-400 animate-pulse">
          Mengompilasi berkas laporan keuangan toko Anda...
        </div>
      </UmkmLayout>
    );
  }

  return (
    <UmkmLayout>
      {/* Kontainer dibatasi print:max-w-[680px] agar pas di grid area cetak dan seimbang tengah */}
      <div className="space-y-6 w-full max-w-4xl mx-auto print:space-y-4 print:p-0 print:max-w-[680px] print:mx-auto flex flex-col items-center">
        
        {/* HEADER MENU */}
        <div className="flex justify-between items-center w-full print:hidden">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Laporan Penjualan</h1>
            <p className="text-xs text-gray-400 font-medium">Lihat dan ekspor data penjualan Anda</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()} 
              className="border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0a2.25 2.25 0 0 1-2.25 2.25H8.59A2.25 2.25 0 0 1 6.34 18m11.32 0h-11.32M19.5 12h.008v.008H19.5V12Zm-.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM18 12V6.75A2.25 2.25 0 0 0 15.75 4.5H8.25A2.25 2.25 0 0 0 6 6.75V12m12 0H6" />
              </svg>
              Cetak
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-sm shadow-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Ekspor
            </button>
          </div>
        </div>

        {/* HEADER PRINT KERTAS */}
        <div className="hidden print:block border-b-2 border-slate-800 pb-3 mb-4 text-center w-full">
          <h1 className="text-xl font-bold text-slate-950 uppercase tracking-wide">LAPORAN PENJUALAN MITRA — {data.businessName || 'WARUNG SARI'}</h1>
          <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Sistem Informasi Kemitraan Karya Rancah (SIKaRa)</p>
        </div>

        {/* 3 CARD INDIKATOR ANTI-NAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3 print:gap-3 w-full">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2 print:shadow-none print:border-slate-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Transaksi</p>
            <h3 className="text-2xl font-bold text-slate-800">{data.stats?.totalTransaksi || 0}</h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2 print:shadow-none print:border-slate-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Pendapatan</p>
            <h3 className="text-2xl font-bold text-slate-800">
              Rp {parseFloat(data.stats?.totalPenjualan || 0).toLocaleString('id-ID')}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2 print:shadow-none print:border-slate-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rata-rata Pesanan</p>
            <h3 className="text-2xl font-bold text-slate-800">
              Rp {data.stats?.totalTransaksi > 0 
                ? Math.round(parseFloat(data.stats.totalPenjualan || 0) / data.stats.totalTransaksi).toLocaleString('id-ID') 
                : 0
              }
            </h3>
          </div>
        </div>

        {/* TABEL DATA TRANSAKSI PENJUALAN */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden print:shadow-none print:border print:border-slate-200 w-full">
          <div className="p-5 border-b border-slate-50 print:px-4">
            <h4 className="font-bold text-slate-800 text-sm">Transaksi Penjualan</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider print:bg-slate-100">
                  <th className="p-4 pl-6 print:pl-4">Tanggal</th>
                  <th className="p-4">Produk</th>
                  <th className="p-4 text-center">Jumlah</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4 text-right pr-6 print:pr-4">Total</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-600 divide-y divide-slate-50 font-medium">
                {data.orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400">Belum ada catatan penjualan yang masuk ke database toko Anda.</td>
                  </tr>
                ) : (
                  data.orders.map((order, idx) => (
                    <tr key={idx}>
                      <td className="p-4 pl-6 text-gray-400 print:pl-4">{order.tanggal}</td>
                      <td className="p-4 font-bold text-slate-800">{order.product_name}</td>
                      <td className="p-4 text-center text-gray-500">{order.quantity}</td>
                      <td className="p-4 text-gray-400">Rp {parseFloat(order.price || 0).toLocaleString('id-ID')}</td>
                      <td className="p-4 text-right pr-6 font-bold text-slate-800 print:pr-4">Rp {parseFloat(order.total || 0).toLocaleString('id-ID')}</td>
                    </tr>
                  ))
                )}
                <tr className="bg-slate-50/50 font-bold text-slate-800 border-t-2 border-slate-800">
                  <td colSpan="2" className="p-4 pl-6 text-sm print:pl-4">Total Keseluruhan</td>
                  <td></td>
                  <td></td>
                  <td className="p-4 text-right pr-6 text-sm text-slate-900 font-extrabold print:pr-4">
                    Rp {parseFloat(data.stats?.totalPenjualan || 0).toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </UmkmLayout>
  );
};

export default UmkmLaporan;