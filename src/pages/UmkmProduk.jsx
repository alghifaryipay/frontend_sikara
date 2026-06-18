import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UmkmLayout from '../components/UmkmLayout';

const UmkmProduk = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  
  // State Asli bawaan data toko Anda (Ditambah umkmId untuk foreign key DB)
  const [data, setData] = useState({ businessName: '', umkmId: null, products: [] });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // State untuk mengendalikan Modal Tambah & Edit Produk
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); 
  const [editId, setEditId] = useState(null); 
  
  // State Khusus Loading saat Upload
  const [isUploading, setIsUploading] = useState(false);

  // 🔥 STATE BARU KHUSUS UPLOAD GAMBAR
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category_name: '',
    price: '',
    stock: '',
    image_url: '' // Akan menampung hasil link dari server
  });

  // Fungsi Tarik Data dari Database
  const fetchProducts = () => {
    if (!userId || userId === 'undefined') {
      navigate('/login');
      return;
    }
    fetch(`https://backend-sikara.onrender.com/api/umkm/products/${userId}`)
      .then((res) => res.json())
      .then((resData) => {
        setData({
          businessName: resData.businessName,
          umkmId: resData.umkmId,
          products: resData.products || []
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [userId, navigate]);

  // Fungsi Buka Modal Mode Tambah Baru
  const openAddModal = () => {
    setIsEditMode(false);
    setEditId(null);
    setFormData({ title: '', category_name: '', price: '', stock: '', image_url: '' });
    setSelectedFile(null);
    setPreviewUrl('');
    setIsModalOpen(true);
  };

  // Fungsi Buka Modal Mode Edit Produk
  const openEditModal = (prod) => {
    setIsEditMode(true);
    setEditId(prod.id);
    setFormData({
      title: prod.title,
      category_name: prod.category_name,
      price: prod.price,
      stock: prod.stock,
      image_url: prod.image_url || ''
    });
    setSelectedFile(null);
    setPreviewUrl(prod.image_url || ''); // Tampilkan gambar lama jika ada
    setIsModalOpen(true);
  };

  // 🔥 FUNGSI BARU: Deteksi file yang dipilih dari PC
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Buat URL preview sementara di browser
    }
  };

  // Fungsi Submit Data Produk (Menangani Tambah & Edit Sekaligus)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.umkmId) {
      alert("ID Lapak tidak ditemukan. Silakan refresh halaman.");
      return;
    }

    setIsUploading(true);
    let finalImageUrl = formData.image_url;

    // 🔥 JIKA USER MEMILIH FILE BARU DARI PC, UPLOAD DULU GAMBARNYA!
    if (selectedFile) {
      const uploadData = new FormData();
      uploadData.append('image', selectedFile);

      try {
        const uploadRes = await fetch('https://backend-sikara.onrender.com/api/upload', {
          method: 'POST',
          body: uploadData
        });
        const uploadResult = await uploadRes.json();

        if (uploadRes.ok) {
          finalImageUrl = uploadResult.imageUrl; // Dapatkan link permanen dari folder backend
        } else {
          alert('Gagal mengupload gambar ke server.');
          setIsUploading(false);
          return; // Hentikan proses simpan jika upload gagal
        }
      } catch (err) {
        console.error('Error upload:', err);
        alert('Server gagal memproses gambar.');
        setIsUploading(false);
        return;
      }
    }

    // Lanjutkan simpan teks data produk ke database dengan URL gambar final
    const payload = {
      umkm_id: data.umkmId,
      ...formData,
      image_url: finalImageUrl 
    };

    const url = isEditMode 
      ? `https://backend-sikara.onrender.com/api/umkm/products/${editId}` 
      : 'https://backend-sikara.onrender.com/api/umkm/products';
    const method = isEditMode ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((resData) => {
        alert(resData.message || 'Perubahan berhasil disimpan!');
        setIsModalOpen(false); 
        fetchProducts(); 
      })
      .catch((err) => console.error("Gagal memproses produk:", err))
      .finally(() => setIsUploading(false));
  };

  // Fungsi Hapus Produk
  const handleDelete = (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${title}" dari etalase?`)) {
      fetch(`https://backend-sikara.onrender.com/api/umkm/products/${id}`, {
        method: 'DELETE'
      })
        .then((res) => res.json())
        .then((resData) => {
          alert(resData.message || 'Produk berhasil dihapus!');
          fetchProducts(); 
        })
        .catch((err) => console.error('Error menghapus produk:', err));
    }
  };

  if (loading) {
    return (
      <UmkmLayout>
        <div className="p-10 text-center text-xs text-gray-400 animate-pulse font-medium">
          Sinkronisasi daftar produk etalase SIKaRa...
        </div>
      </UmkmLayout>
    );
  }

  const filteredProducts = data.products.filter((prod) =>
    prod.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <UmkmLayout>
      <div className="space-y-6 w-full max-w-[1200px] mx-auto">
        
        {/* HEADER MENU */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Produk</h1>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">Kelola dan terbitkan semua komoditas dari {data.businessName}</p>
          </div>
          <button 
            onClick={openAddModal}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-100 flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Produk
          </button>
        </div>

        {/* SEARCH BAR CARD */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50 relative flex items-center">
            <span className="absolute left-9 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.603Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Cari produk Anda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-gray-400"
            />
          </div>

          {/* DATA TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-16">Gambar</th>
                  <th className="p-4">Nama Produk</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4 text-center">Stok</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-600 divide-y divide-slate-50 font-medium">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-400">Belum ada produk terbitan toko Anda.</td>
                  </tr>
                ) : (
                  filteredProducts.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center overflow-hidden border border-blue-100 shadow-sm">
                          {prod.image_url ? (
                            <img src={prod.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-800 max-w-[150px] truncate">{prod.title}</td>
                      <td className="p-4 text-gray-400">{prod.category_name}</td>
                      <td className="p-4 font-bold text-slate-700">Rp {parseFloat(prod.price).toLocaleString('id-ID')}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${prod.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                          {prod.stock}
                        </span>
                      </td>
                      {/* 🔥 AREA TOMBOL EDIT & HAPUS */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Produk"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(prod.id, prod.title)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Produk"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =======================================================
            MODAL COMPONENT POPUP: FORM TAMBAH / EDIT PRODUK
            ======================================================= */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {isEditMode ? 'Edit Data Produk' : 'Tambah Produk Baru'}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {isEditMode ? 'Perbarui detail komoditas etalase Anda' : 'Terbitkan komoditas jualan ke ekosistem SIKaRa'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-slate-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 🔥 FITUR BARU: AREA UPLOAD GAMBAR */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4">
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Foto Produk</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-slate-500 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" 
                    />
                  </div>
                </div>

                {/* Nama Produk */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nama Produk</label>
                  <input 
                    type="text" required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Contoh: Bouquet Mawar Merah Premium"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Kategori */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Kategori Usaha</label>
                  <select 
                    required
                    value={formData.category_name}
                    onChange={(e) => setFormData({...formData, category_name: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="" disabled hidden>-- Pilih Kategori Produk --</option>
                    <option value="Kuliner">Kuliner (Makanan & Minuman)</option>
                    <option value="Fashion">Fashion & Pakaian</option>
                    <option value="Kerajinan">Kerajinan Tangan / Bouquet</option>
                    <option value="Agrobisnis">Pertanian / Agrobisnis</option>
                    <option value="Jasa">Jasa / Layanan</option>
                  </select>
                </div>

                {/* Grid Harga & Stok */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Harga (Rp)</label>
                    <input 
                      type="number" required min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="50000"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Stok Barang</label>
                    <input 
                      type="number" required min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      placeholder="25"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex gap-2 pt-3 border-t border-slate-50">
                  <button 
                    type="button"
                    disabled={isUploading}
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-3 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={isUploading}
                    className={`w-1/2 text-white text-xs font-bold py-3 rounded-xl transition-colors shadow-sm ${
                      isUploading ? 'bg-blue-300' : isEditMode ? 'bg-purple-500 hover:bg-purple-600 shadow-purple-100' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-100'
                    }`}
                  >
                    {isUploading ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Terbitkan Produk'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </UmkmLayout>
  );
};

export default UmkmProduk;