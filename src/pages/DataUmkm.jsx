import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { PlusIcon } from '../components/Icons';

const DataUmkm = () => {
  const [umkmList, setUmkmList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data real-time dari backend
  useEffect(() => {
    fetch('http://localhost:5000/api/admin/umkm')
      .then((res) => res.json())
      .then((data) => {
        setUmkmList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetch data UMKM:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-sm font-medium text-gray-400 animate-pulse">Memuat data usaha terdaftar...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER ATAS: JUDUL & TOMBOL DAFTARKAN */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Data UMKM</h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">Lihat dan kelola usaha UMKM terdaftar</p>
          </div>
          {/* Tombol Biru Daftarkan UMKM Sesuai Mockup */}
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm shadow-blue-100">
            <PlusIcon className="w-4 h-4 text-white" />
            Daftarkan UMKM
          </button>
        </div>

        {/* CONTAINER DAFTAR KARTU UMKM */}
        <div className="space-y-4">
          {umkmList.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-2xl border border-slate-100 text-gray-400 text-sm">
              Belum ada mitra UMKM yang terdata di database.
            </div>
          ) : (
            umkmList.map((umkm) => (
              <div key={umkm.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
                
                {/* INFO KIRI: LOGO & DETAIL PROFIL */}
                <div className="flex gap-5">
                  {/* Icon Box Toko Biru Lembut */}
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V21m3 0H18m-6 0H6m4-13.5H9m4 0h-1m4 0h-1m-4 3H9m4 0h-1m4 0h-1m-8 6h12.5A2.25 2.25 0 0 0 21 16.5v-10.5A2.25 2.25 0 0 0 18.75 3.75H5.25A2.25 2.25 0 0 0 3 6v10.5A2.25 2.25 0 0 0 5.25 18.75V21a.75.75 0 0 0 .75.75h6.75a.75.75 0 0 0 .75-.75v-1.5" />
                    </svg>
                  </div>
                  
                  {/* Data Detail Toko */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-base leading-none">{umkm.business_name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        umkm.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {umkm.status}
                      </span>
                    </div>

                    {/* Alamat, Email, No Telp Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1.5 text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-2">📍 {umkm.location || 'Kecamatan Rancah'}</span>
                      <span className="flex items-center gap-2">📞 {umkm.phone || '-'}</span>
                      <span className="flex items-center gap-2">✉️ {umkm.email}</span>
                      <span className="flex items-center gap-1">👤 Pemilik: <strong className="text-slate-700 font-semibold">{umkm.owner_name}</strong></span>
                    </div>

                    {/* Kategori & Total Produk Badge */}
                    <div className="flex gap-2 pt-1">
                      <span className="bg-slate-50 border border-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-xl text-[10px]">
                        Kategori: <span className="font-bold">{umkm.category || 'Umum'}</span>
                      </span>
                      <span className="bg-slate-50 border border-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-xl text-[10px]">
                        Produk: <span className="font-bold text-blue-500">{umkm.total_products || 0}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* AKSI KANAN: LIHAT DETAIL */}
                <div>
                  <button className="text-blue-500 hover:text-blue-600 font-bold text-xs hover:underline transition-colors">
                    Lihat Detail
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DataUmkm;