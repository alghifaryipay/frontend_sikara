import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { PlusIcon } from '../components/Icons';

const DataProduk = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // State untuk mengontrol buka/tutup Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State menampung data input produk baru
  const [formData, setFormData] = useState({
    title: '',
    category_name: '',
    price: '',
    stock: '',
    business_name: '',
    image_url: ''
  });

  // Fungsi ambil data dari backend
  const fetchProducts = () => {
    fetch('https://backend-sikara.onrender.com/api/admin/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetch data produk:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fungsi kirim data produk baru ke backend (POST)
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('https://backend-sikara.onrender.com/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          alert('Produk baru berhasil ditambahkan!');
          setIsModalOpen(false); // Tutup modal
          setFormData({
            title: '',
            category_name: '',
            price: '',
            stock: '',
            business_name: '',
            image_url: ''
          });
          fetchProducts(); // Refresh tabel produk otomatis
        } else {
          // 🔥 PERBAIKAN: Menampilkan alasan penolakan dari database (misal nama UMKM salah ketik)
          alert(data.message || 'Gagal menambahkan produk baru.');
        }
      })
      .catch((err) => {
        console.error('Error post data produk:', err);
        alert('Gagal terhubung ke server backend.');
      });
  };

  // Fungsi menangani perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Fungsi Aksi Hapus Produk Real-time
  const handleDelete = (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${title}"?`)) {
      fetch(`https://backend-sikara.onrender.com/api/admin/products/${id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            alert('Produk berhasil dihapus!');
            fetchProducts(); // Refresh data tabel otomatis
          } else {
            alert('Gagal menghapus produk.');
          }
        })
        .catch((err) => console.error('Error delete produk:', err));
    }
  };

  // Filter Produk Berdasarkan Apa yang Diketik User di Search Bar
  const filteredProducts = products.filter((prod) =>
    prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prod.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prod.business_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER ATAS */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Produk</h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">Kelola semua produk dari seluruh UMKM</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm shadow-blue-100"
          >
            <PlusIcon className="w-4 h-4" />
            Tambah Produk
          </button>
        </div>

        {/* CONTAINER UTAMA TABEL */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* SEARCH BAR INPUT */}
          <div className="p-5 border-b border-slate-50 relative flex items-center">
            <span className="absolute left-9 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.603Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-gray-400"
            />
          </div>

          {/* RENDERING TABEL PRODUK */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center text-xs text-gray-400 animate-pulse">Memuat inventori barang...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-4 pl-6">Gambar</th>
                    <th className="p-4">Nama Produk</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Harga</th>
                    <th className="p-4 text-center">Stok</th>
                    <th className="p-4">UMKM</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-600 divide-y divide-slate-50 font-medium">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-400">Tidak ada produk yang cocok dengan pencarian Anda.</td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center text-gray-400 shadow-sm">
                            {prod.image_url ? (
                              <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                              </svg>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-800 max-w-xs truncate">{prod.title}</td>
                        <td className="p-4 text-gray-400">{prod.category_name}</td>
                        <td className="p-4 font-bold text-slate-700">Rp {parseFloat(prod.price).toLocaleString('id-ID')}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${prod.stock > 20 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                            {prod.stock}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">{prod.business_name}</td>
                        <td className="p-4">
                          <div className="flex justify-center items-center gap-3">
                            <button className="text-gray-400 hover:text-blue-500 transition-colors p-1 hover:bg-slate-50 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id, prod.title)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-lg"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .         562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* MODAL POPUP: FORM TAMBAH PRODUK BARU */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

              {/* Header Modal */}
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-800">Tambah Produk Baru</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-slate-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nama Produk</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Contoh: Kripik Pisang Manis"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Kategori</label>
                    <input
                      type="text"
                      name="category_name"
                      required
                      value={formData.category_name}
                      onChange={handleInputChange}
                      placeholder="Makanan, Fashion, dll"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nama UMKM / Toko</label>
                    <input
                      type="text"
                      name="business_name"
                      required
                      value={formData.business_name}
                      onChange={handleInputChange}
                      placeholder="Nama Lapak Mitra"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Harga (Rp)</label>
                    <input
                      type="number"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="15000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Jumlah Stok</label>
                    <input
                      type="number"
                      name="stock"
                      required
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="50"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">URL Gambar Produk (Opsional)</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/gambar.jpg"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Footer / Tombol Konfirmasi */}
                <div className="pt-2 flex justify-end gap-3 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors shadow-sm shadow-blue-100"
                  >
                    Simpan Produk
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default DataProduk;