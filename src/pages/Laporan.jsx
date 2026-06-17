import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

const Laporan = () => {
  // State awal disesuaikan dengan struktur objek data real dari backend
  const [reportData, setReportData] = useState({
    stats: {
      totalUMKM: 0,
      totalProduk: 0,
      umkmAktif: 0,
      tingkatAktif: 0,
      rataRataProduk: 0,
      totalKategoriUMKM: 0,
      kategoriDominan: '-',
      percentDominan: 0
    },
    umkmKategori: [],
    produkKategori: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/laporan')
      .then((res) => res.json())
      .then((data) => {
        setReportData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetch data laporan:', err);
        setLoading(false);
      });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Array variasi warna ungu untuk progress bar UMKM
  const purpleColors = ['bg-purple-500', 'bg-purple-400', 'bg-purple-300', 'bg-purple-200', 'bg-purple-100'];
  // Array variasi warna biru untuk progress bar Produk
  const blueColors = ['bg-blue-500', 'bg-blue-400', 'bg-blue-300', 'bg-blue-200', 'bg-slate-300'];

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-xs text-gray-400 animate-pulse">
          Mengompilasi laporan langsung dari database...
        </div>
      </AdminLayout>
    );
  }

  const { stats, umkmKategori, produkKategori } = reportData;

  return (
    <AdminLayout>
      <div className="space-y-6 w-full print:p-0 print:m-0">
        
        {/* HEADER UTAMA */}
        <div className="flex justify-between items-center print:hidden">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Laporan Data</h1>
            <p className="text-xs text-gray-400 font-medium">Ringkasan data UMKM dan produk</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="border border-purple-200 text-purple-600 bg-purple-50/50 hover:bg-purple-50 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0a2.25 2.25 0 0 1-2.25 2.25H8.59A2.25 2.25 0 0 1 6.34 18m11.32 0h-11.32M19.5 12h.008v.008H19.5V12Zm-.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM18 12V6.75A2.25 2.25 0 0 0 15.75 4.5H8.25A2.25 2.25 0 0 0 6 6.75V12m12 0H6" />
              </svg>
              Cetak
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-sm shadow-purple-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Ekspor
            </button>
          </div>
        </div>

        {/* PRINT ONLY HEADER */}
        <div className="hidden print:block border-b-2 border-slate-800 pb-3 mb-6 text-center">
          <h1 className="text-xl font-bold text-slate-950 uppercase">Laporan Data Ringkasan SIKaRa</h1>
          <p className="text-[10px] text-gray-500 mt-0.5">Sistem Informasi Karya Rancah</p>
        </div>

        {/* 3 KARTU STATISTIK DATA REAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 print:shadow-none print:border-slate-200">
            <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18M6.75 6.75H12m1.5 3H18M13.5 1h7.5M13.5 13.5H18" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total UMKM</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-0.5">{stats.totalUMKM}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 print:shadow-none print:border-slate-200">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Produk</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-0.5">{stats.totalProduk}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 print:shadow-none print:border-slate-200">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">UMKM Aktif</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-0.5">{stats.umkmAktif}</h3>
            </div>
          </div>
        </div>

        {/* SEKTOR GRID DUA TABEL KATEGORI DATA REAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* TABEL 1: UMKM BERDASARKAN KATEGORI */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-4 print:shadow-none print:border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm">UMKM Berdasarkan Kategori</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-center">Jumlah</th>
                    <th className="p-3 text-right">Persentase</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700 divide-y divide-slate-50 font-medium">
                  {umkmKategori.length === 0 ? (
                    <tr><td colSpan="3" className="p-4 text-center text-gray-400">Tidak ada data</td></tr>
                  ) : (
                    umkmKategori.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-semibold text-slate-800">{item.name}</td>
                        <td className="p-3 text-center text-gray-500">{item.count}</td>
                        <td className="p-3 flex items-center justify-end gap-3 pt-4">
                          <span className="text-gray-400 text-[11px] font-medium">{item.percent}%</span>
                          <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden inline-block">
                            <div className={`${purpleColors[idx % purpleColors.length]} h-full rounded-full`} style={{ width: `${item.percent}%` }}></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABEL 2: PRODUK BERDASARKAN KATEGORI */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-4 print:shadow-none print:border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm">Produk Berdasarkan Kategori</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-center">Jumlah</th>
                    <th className="p-3 text-right">Persentase</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700 divide-y divide-slate-50 font-medium">
                  {produkKategori.length === 0 ? (
                    <tr><td colSpan="3" className="p-4 text-center text-gray-400">Tidak ada data</td></tr>
                  ) : (
                    produkKategori.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-semibold text-slate-800">{item.name}</td>
                        <td className="p-3 text-center text-gray-500">{item.count}</td>
                        <td className="p-3 flex items-center justify-end gap-3 pt-4">
                          <span className="text-gray-400 text-[11px] font-medium">{item.percent}%</span>
                          <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden inline-block">
                            <div className={`${blueColors[idx % blueColors.length]} h-full rounded-full`} style={{ width: `${item.percent}%` }}></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* CONTAINER BAWAH: RINGKASAN LAPORAN REAL-TIME */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 print:shadow-none print:border-slate-200">
          <h3 className="font-bold text-slate-800 text-sm">Ringkasan Laporan</h3>
          <ul className="text-xs text-gray-500 space-y-2.5 list-disc pl-5 font-medium leading-relaxed">
            <li>Total UMKM terdaftar: <strong className="text-slate-700 font-bold">{stats.totalUMKM}</strong> usaha dari <strong className="text-slate-700 font-bold">{stats.totalKategoriUMKM}</strong> kategori</li>
            <li>Tingkat UMKM aktif: <strong className="text-slate-700 font-bold">{stats.tingkatAktif}%</strong> ({stats.umkmAktif} dari {stats.totalUMKM})</li>
            <li>Total produk terdaftar: <strong className="text-slate-700 font-bold">{stats.totalProduk}</strong> item dari berbagai kategori</li>
            <li><strong className="text-slate-700 font-bold">{stats.kategoriDominan}</strong> adalah kategori dominan dengan <strong className="text-slate-700 font-bold">{stats.percentDominan}%</strong> dari total UMKM</li>
            <li>Rata-rata produk per UMKM: <strong className="text-slate-700 font-bold">{stats.rataRataProduk}</strong> item</li>
          </ul>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Laporan;