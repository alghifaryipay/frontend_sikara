import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { PlusIcon } from '../components/Icons';

const DataUmkm = () => {
  const [umkmList, setUmkmList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk kontrol Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUmkm, setSelectedUmkm] = useState(null);

  // State untuk form Tambah UMKM
  const [formData, setFormData] = useState({
    business_name: '', owner_name: '', email: '', phone: '', location: '', category: '', status: 'Aktif'
  });

  // State untuk form Edit UMKM
  const [editData, setEditData] = useState({});

  const fetchUmkm = () => {
    fetch('https://backend-sikara.onrender.com/api/admin/umkm')
      .then((res) => res.json())
      .then((data) => {
        setUmkmList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetch data UMKM:', err);
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    fetch('https://backend-sikara.onrender.com/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        const parsed = Array.isArray(data) ? data.map(c => typeof c === 'object' ? c.name : c) : [];
        const defaultCategories = ['Makanan & Minuman', 'Fashion', 'Kerajinan', 'Ritel'];
        setCategories(parsed.length > 0 ? parsed : defaultCategories);
      })
      .catch((err) => {
        console.error('Error fetch data kategori:', err);
        setCategories(['Makanan & Minuman', 'Fashion', 'Kerajinan', 'Ritel']);
      });
  };

  useEffect(() => {
    fetchUmkm();
    fetchCategories();
  }, []);

  // 🔥 FUNGSI HAPUS UMKM
  const handleDelete = (id, businessName) => {
    if (window.confirm(`Yakin ingin menghapus mitra "${businessName}"? Semua data produk dan akun loginnya akan ikut terhapus permanen!`)) {
      fetch(`https://backend-sikara.onrender.com/api/admin/umkm/${id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            alert('Data UMKM berhasil dihapus!');
            fetchUmkm();
          } else {
            alert('Gagal menghapus UMKM.');
          }
        })
        .catch((err) => console.error('Error delete UMKM:', err));
    }
  };

  // 🔥 FUNGSI BUKA MODAL EDIT
  const openEditModal = (umkm) => {
    setEditData({ ...umkm }); // Salin data yang diklik ke state form edit
    setIsEditModalOpen(true);
  };

  // 🔥 FUNGSI SUBMIT UPDATE (EDIT) UMKM
  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`https://backend-sikara.onrender.com/api/admin/umkm/${editData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
      .then(async (res) => {
        if (res.ok) {
          alert('Data UMKM berhasil diperbarui!');
          setIsEditModalOpen(false);
          fetchUmkm();
        } else {
          alert('Gagal memperbarui data UMKM.');
        }
      })
      .catch((err) => console.error('Error update data UMKM:', err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('https://backend-sikara.onrender.com/api/admin/umkm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        if (res.ok) {
          alert('Mitra UMKM baru berhasil didaftarkan!');
          setIsModalOpen(false);
          setFormData({ business_name: '', owner_name: '', email: '', phone: '', location: '', category: '', status: 'Aktif' });
          fetchUmkm();
        } else {
          const errorDetail = await res.json().catch(() => ({}));
          alert(`Gagal mendaftarkan UMKM baru: ${errorDetail.message || 'Periksa validasi server/database'}`);
        }
      })
      .catch((err) => console.error('Error post data UMKM:', err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Data UMKM</h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">Lihat dan kelola usaha UMKM terdaftar</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm shadow-blue-100"
          >
            <PlusIcon className="w-4 h-4 text-white" />
            Daftarkan UMKM
          </button>
        </div>

        <div className="space-y-4">
          {umkmList.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-2xl border border-slate-100 text-gray-400 text-sm">
              Belum ada mitra UMKM yang terdata di database.
            </div>
          ) : (
            umkmList.map((umkm) => (
              <div key={umkm.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V21m3 0H18m-6 0H6m4-13.5H9m4 0h-1m4 0h-1m-4 3H9m4 0h-1m4 0h-1m-8 6h12.5A2.25 2.25 0 0 0 21 16.5v-10.5A2.25 2.25 0 0 0 18.75 3.75H5.25A2.25 2.25 0 0 0 3 6v10.5A2.25 2.25 0 0 0 5.25 18.75V21a.75.75 0 0 0 .75 .75h6.75a.75.75 0 0 0 .75-.75v-1.5" />
                    </svg>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-base leading-none">{umkm.business_name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${umkm.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                        {umkm.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1.5 text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-2">📍 {umkm.location || 'Kecamatan Rancah'}</span>
                      <span className="flex items-center gap-2">📞 {umkm.phone || '-'}</span>
                      <span className="flex items-center gap-2">✉️ {umkm.email}</span>
                      <span className="flex items-center gap-1">👤 Pemilik: <strong className="text-slate-700 font-semibold">{umkm.owner_name}</strong></span>
                    </div>

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

                {/* 🔥 PERBAIKAN: Tombol Aksi (Detail, Edit, Hapus) */}
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedUmkm(umkm)} className="text-blue-500 hover:text-blue-600 font-bold text-xs hover:underline transition-colors">
                    Lihat Detail
                  </button>
                  <button onClick={() => openEditModal(umkm)} className="text-orange-500 hover:text-orange-600 transition-colors p-1.5 bg-orange-50 rounded-lg" title="Edit Data">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-400 hover:text-blue-500"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(umkm.id, umkm.business_name)} className="text-red-500 hover:text-red-600 transition-colors p-1.5 bg-red-50 rounded-lg" title="Hapus Permanen">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-red-400 hover:text-red-600"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* MODAL DETAIL (Sama Seperti Sebelumnya) */}
        {selectedUmkm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-800">Profil Detail Usaha</h3>
                </div>
                <button onClick={() => setSelectedUmkm(null)} className="text-gray-400 hover:text-slate-600 transition-colors">
                  ✖
                </button>
              </div>
              <div className="p-6 space-y-5 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800">{selectedUmkm.business_name}</h2>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">ID Registrasi Lapak: #{selectedUmkm.id || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Nama Pemilik</label>
                    <p className="font-semibold text-slate-700 bg-slate-50/50 px-3 py-2 rounded-lg border border-slate-100/70">{selectedUmkm.owner_name}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Kategori Sektor</label>
                    <p className="font-semibold text-purple-600 bg-purple-50/30 px-3 py-2 rounded-lg border border-purple-100/50">{selectedUmkm.category || 'Umum'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">No. Telepon</label>
                    <p className="font-semibold text-slate-700 bg-slate-50/50 px-3 py-2 rounded-lg border border-slate-100/70">{selectedUmkm.phone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Email</label>
                    <p className="font-semibold text-slate-700 bg-slate-50/50 px-3 py-2 rounded-lg border border-slate-100/70 truncate">{selectedUmkm.email}</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div className="text-slate-500 font-medium">Total produk tayang di SIKaRa:</div>
                  <div className="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-xl text-xs border border-blue-100">{selectedUmkm.total_products || 0} Item Barang</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL FORM TAMBAH UMKM BARU */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-800">Daftarkan UMKM Baru</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-slate-600">✖</button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nama UMKM / Usaha</label>
                  <input type="text" name="business_name" required value={formData.business_name} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:border-blue-400 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nama Pemilik Usaha</label>
                  <input type="text" name="owner_name" required value={formData.owner_name} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:border-blue-400 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Kategori</label>
                    <select name="category" required value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:border-blue-400 outline-none">
                      <option value="" disabled hidden>Pilih Kategori</option>
                      {categories.map((cat, index) => (<option key={index} value={cat}>{cat}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:border-blue-400 outline-none">
                      <option value="Aktif">Aktif</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">No. WA</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:border-blue-400 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:border-blue-400 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Lokasi</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:border-blue-400 outline-none" />
                </div>
                <div className="pt-2 flex justify-end gap-3 border-t border-slate-50">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl">Batal</button>
                  <button type="submit" className="px-4 py-2 text-xs font-semibold bg-blue-500 text-white rounded-xl">Daftarkan Mitra</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 🔥 MODAL FORM EDIT UMKM */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-orange-50/50">
                <h3 className="text-sm font-bold text-slate-800">Edit Data UMKM</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-slate-600">✖</button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nama UMKM / Usaha</label>
                  <input type="text" name="business_name" required value={editData.business_name} onChange={handleEditInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:border-orange-400 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nama Pemilik Usaha</label>
                  <input type="text" name="owner_name" required value={editData.owner_name} onChange={handleEditInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:border-orange-400 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Kategori</label>
                    <select name="category" required value={editData.category} onChange={handleEditInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:border-orange-400 outline-none">
                      <option value="" disabled hidden>Pilih Kategori</option>
                      {categories.map((cat, index) => (<option key={index} value={cat}>{cat}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Status</label>
                    <select name="status" value={editData.status} onChange={handleEditInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:border-orange-400 outline-none">
                      <option value="Aktif">Aktif</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">No. WA</label>
                    <input type="text" name="phone" value={editData.phone} onChange={handleEditInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:border-orange-400 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Email</label>
                    <input type="email" name="email" required value={editData.email} onChange={handleEditInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:border-orange-400 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Lokasi</label>
                  <input type="text" name="location" value={editData.location} onChange={handleEditInputChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:border-orange-400 outline-none" />
                </div>
                <div className="pt-2 flex justify-end gap-3 border-t border-slate-50">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl">Batal</button>
                  <button type="submit" className="px-4 py-2 text-xs font-semibold bg-blue-500 text-white rounded-xl">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default DataUmkm;