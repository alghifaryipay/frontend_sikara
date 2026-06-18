import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

const Laporan = () => {
  const [dataLaporan, setDataLaporan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil data statistik dari backend
  useEffect(() => {
    fetch('https://backend-sikara.onrender.com/api/admin/laporan')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat laporan database');
        return res.json();
      })
      .then((data) => {
        setDataLaporan(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching report data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-sm font-medium text-purple-500 animate-pulse">Memuat data laporan...</p>
        </div>
      </AdminLayout>
    );
  }

  const { stats, umkmKategori, produkKategori } = dataLaporan;

  return (
    <AdminLayout>
      {/* Tambahan style printColorAdjust agar background color tercetak di kertas */}
      <div className="space-y-6" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Laporan Data</h1>
            <p className="text-sm text-slate-500 mt-1">Ringkasan data UMKM dan produk</p>
          </div>
          
          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3 print:hidden">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 border border-purple-200 text-purple-500 bg-white rounded-lg font-medium hover:bg-purple-50 transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#9b72e5] text-white rounded-lg font-medium hover:bg-purple-600 transition-colors text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Ekspor
            </button>
          </div>
        </div>

        {/* KARTU STATISTIK UTAMA - Ditambahkan print:grid-cols-3 agar tetap 3 kolom saat dicetak */}
        <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 print:border-slate-300 shadow-sm print:shadow-none flex flex-col justify-center break-inside-avoid">
            <div className="flex items-center gap-3 mb-2 md:mb-4">
              <div className="p-2 bg-purple-50 print:bg-purple-100 rounded-lg text-[#9b72e5]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-500">Total UMKM</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800">{stats?.totalUMKM || 0}</h3>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 print:border-slate-300 shadow-sm print:shadow-none flex flex-col justify-center break-inside-avoid">
            <div className="flex items-center gap-3 mb-2 md:mb-4">
              <div className="p-2 bg-blue-50 print:bg-blue-100 rounded-lg text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-500">Total Produk</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800">{stats?.totalProduk || 0}</h3>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 print:border-slate-300 shadow-sm print:shadow-none flex flex-col justify-center break-inside-avoid">
            <div className="flex items-center gap-3 mb-2 md:mb-4">
              <div className="p-2 bg-emerald-50 print:bg-emerald-100 rounded-lg text-emerald-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-500">UMKM Aktif</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800">{stats?.umkmAktif || 0}</h3>
          </div>
        </div>

        {/* TABEL DATA KATEGORI - Ditambahkan print:grid-cols-1 agar ke bawah rapi di kertas A4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 print:grid-cols-1 gap-6">
          
          {/* TABEL UMKM BERDASARKAN KATEGORI */}
          <div className="bg-white rounded-2xl border border-slate-100 print:border-slate-300 shadow-sm print:shadow-none overflow-hidden break-inside-avoid">
            <div className="p-4 md:p-6 border-b border-slate-50 print:border-slate-200">
              <h4 className="text-lg font-bold text-slate-800">UMKM Berdasarkan Kategori</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 bg-slate-50 print:bg-slate-100 border-y border-slate-100 print:border-slate-300">
                  <tr>
                    <th scope="col" className="px-4 md:px-6 py-4 font-semibold">Kategori</th>
                    <th scope="col" className="px-4 md:px-6 py-4 font-semibold">Jumlah</th>
                    <th scope="col" className="px-4 md:px-6 py-4 font-semibold">Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {umkmKategori && umkmKategori.length > 0 ? (
                    umkmKategori.map((kat, index) => (
                      <tr key={index} className="bg-white border-b border-slate-50 print:border-slate-200 last:border-0 hover:bg-slate-50/50">
                        <td className="px-4 md:px-6 py-4 font-medium text-slate-700">{kat.name}</td>
                        <td className="px-4 md:px-6 py-4">{kat.count || 0}</td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-1.5 bg-purple-100 rounded-full overflow-hidden flex-shrink-0">
                              <div className="h-full bg-[#9b72e5] rounded-full print:bg-[#9b72e5]" style={{ width: `${kat.percent}%` }}></div>
                            </div>
                            <span className="text-slate-500 min-w-[40px]">{kat.percent}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-slate-400">Belum ada data kategori UMKM.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABEL PRODUK BERDASARKAN KATEGORI */}
          <div className="bg-white rounded-2xl border border-slate-100 print:border-slate-300 shadow-sm print:shadow-none overflow-hidden break-inside-avoid">
            <div className="p-4 md:p-6 border-b border-slate-50 print:border-slate-200">
              <h4 className="text-lg font-bold text-slate-800">Produk Berdasarkan Kategori</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 bg-slate-50 print:bg-slate-100 border-y border-slate-100 print:border-slate-300">
                  <tr>
                    <th scope="col" className="px-4 md:px-6 py-4 font-semibold">Kategori</th>
                    <th scope="col" className="px-4 md:px-6 py-4 font-semibold">Jumlah</th>
                    <th scope="col" className="px-4 md:px-6 py-4 font-semibold">Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {produkKategori && produkKategori.length > 0 ? (
                    produkKategori.map((prod, index) => (
                      <tr key={index} className="bg-white border-b border-slate-50 print:border-slate-200 last:border-0 hover:bg-slate-50/50">
                        <td className="px-4 md:px-6 py-4 font-medium text-slate-700">{prod.name}</td>
                        <td className="px-4 md:px-6 py-4">{prod.count || 0}</td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-1.5 bg-blue-100 rounded-full overflow-hidden flex-shrink-0">
                              <div className="h-full bg-blue-500 rounded-full print:bg-blue-500" style={{ width: `${prod.percent}%` }}></div>
                            </div>
                            <span className="text-slate-500 min-w-[40px]">{prod.percent}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-slate-400">Belum ada data kategori produk.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RINGKASAN LAPORAN */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 print:border-slate-300 shadow-sm print:shadow-none break-inside-avoid mt-6">
          <h4 className="text-lg font-bold text-slate-800 mb-5">Ringkasan Laporan</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 print:bg-slate-600 mt-1.5 flex-shrink-0"></span>
              <span>Total UMKM terdaftar: {stats?.totalUMKM || 0} usaha dari {umkmKategori?.length || 0} kategori</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 print:bg-slate-600 mt-1.5 flex-shrink-0"></span>
              <span>Tingkat UMKM aktif: {stats?.tingkatAktif || 0}% ({stats?.umkmAktif || 0} dari {stats?.totalUMKM || 0})</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 print:bg-slate-600 mt-1.5 flex-shrink-0"></span>
              <span>Total produk terdaftar: {stats?.totalProduk || 0} item dari berbagai kategori</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 print:bg-slate-600 mt-1.5 flex-shrink-0"></span>
              <span>{stats?.kategoriDominan || '-'} adalah kategori dominan dengan {stats?.percentDominan || 0}% dari total UMKM</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 print:bg-slate-600 mt-1.5 flex-shrink-0"></span>
              <span>Rata-rata produk per UMKM: {stats?.rataRataProduk || 0} item</span>
            </li>
          </ul>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Laporan;