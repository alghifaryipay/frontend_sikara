import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UmkmLayout from '../components/UmkmLayout';

const UmkmProduk = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  
  // State Asli bawaan data toko Anda
  const [data, setData] = useState({ businessName: '', products: [] });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // REVISI: State untuk mengendalikan Modal Tambah Produk
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category_name: '',
    price: '',
    stock: '',
    image_url: ''
  });

  const fetchProducts = () => {
    if (!userId || userId === 'undefined') {
      navigate('/login');
      return;
    }
    fetch(`http://localhost:5000/api/umkm/products/${userId}`)
      .then((res) => res.json())
      .then((resData) => {
        setData({
          businessName: resData.businessName,
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

  // Fungsi Kirim Data Produk Baru ke Backend
  const handleAddProductSubmit = (e) => {
    e.preventDefault();

    const payload = {
      userId: userId,
      ...formData
    };

    fetch('http://localhost:5000/api/umkm/add-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((resData) => {
        alert(resData.message);
        setIsModalOpen(false); // Tutup Modal
        setFormData({ title: '', category_name: '', price: '', stock: '', image_url: '' }); // Reset Form
        fetchProducts(); // Refresh isi tabel otomatis tanpa reload browser!
      })
      .catch((err) => console.error("Gagal tambah produk:", err));
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
          {/* REVISI: Tambahkan onClick untuk membuka modal popup */}
          <button 
            onClick={() => setIsModalOpen(true)}
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
                  <th className="p-4 pl-6">Gambar</th>
                  <th className="p-4">Nama Produk</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4 text-center">Stok</th>
                  <th className="p-4">UMKM</th>
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
                      <td className="p-4 font-bold text-slate-800">{prod.title}</td>
                      <td className="p-4 text-gray-400">{prod.category_name}</td>
                      <td className="p-4 font-bold text-slate-700">Rp {parseFloat(prod.price).toLocaleString('id-ID')}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${prod.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                          {prod.stock}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{data.businessName}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =======================================================
            MODAL COMPONENT POPUP: FORM TAMBAH PRODUK BARU
            ======================================================= */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Tambah Produk Baru</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Terbitkan komoditas jualan ke ekosistem SIKaRa</p>
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

              <form onSubmit={handleAddProductSubmit} className="space-y-3">
                {/* Nama Produk */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nama Produk</label>
                  <input 
                    type="text" required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Contoh: Bouquet Mawar Merah Premium"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Kategori */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Kategori Usaha</label>
                  <select 
                    required
                    value={formData.category_name}
                    onChange={(e) => setFormData({...formData, category_name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  >
                    <option value="">-- Pilih Kategori Produk --</option>
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
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Stok Barang</label>
                    <input 
                      type="number" required min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      placeholder="25"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Link URL Gambar */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">URL Gambar Produk (Opsional)</label>
                  <input 
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://example.com/gambar-produk.jpg"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Tombol Aksi */}
                <div className="flex gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-100"
                  >
                    Terbitkan Produk
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