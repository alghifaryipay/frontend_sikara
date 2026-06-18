import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [umkmList, setUmkmList] = useState([]);

  // State Mode Gelap / Terang
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State Kontrol Modal Detail & Order
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState('Ambil Sendiri');

  // Cek Status Login
  const isLogged = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const userName = localStorage.getItem('name');

  useEffect(() => {
    // Cek preferensi tema sebelumnya
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);

    // 1. Tarik Data Produk
    fetch('https://backend-sikara.onrender.com/api/public/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetch produk:', err));

    // 2. Tarik Data Profil UMKM
    fetch('https://backend-sikara.onrender.com/api/admin/umkm')
      .then((res) => res.json())
      .then((data) => {
        const latestUmkm = data.slice(0, 8);
        setUmkmList(latestUmkm);
      })
      .catch((err) => console.error('Error fetch UMKM:', err));
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  const handleProcessOrder = () => {
    if (!isLogged || userRole !== 'pengguna') {
      alert('Silakan login sebagai Pengguna (User) terlebih dahulu untuk melakukan pemesanan.');
      navigate('/login');
      return;
    }

    alert(`Yeay! Pesanan "${selectedProduct.title}" dengan metode pengiriman "${deliveryMethod}" berhasil diproses dan diteruskan ke toko ${selectedProduct.business_name}.`);
    setSelectedProduct(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  // Data Cadangan jika database UMKM kosong
  const displayUmkm = umkmList.length > 0 ? umkmList : [
    { id: 'd1', business_name: 'Saroja Mini' },
    { id: 'd2', business_name: 'Batik Tulis' },
    { id: 'd3', business_name: 'Kopi Karuhun' },
    { id: 'd4', business_name: 'Kerajinan Kayu' },
    { id: 'd5', business_name: 'Bouquet Bunga' },
    { id: 'd6', business_name: 'Dapur Sunda' },
    { id: 'd7', business_name: 'Tas Rotan' },
    { id: 'd8', business_name: 'Snack Lokal' },
  ];

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>

      {/* NAVBAR UTAMA DINAMIS */}
      <nav className={`p-4 px-6 md:px-12 flex justify-between items-center shadow-sm sticky top-0 z-40 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800/95 border-b border-slate-700 backdrop-blur' : 'bg-white/95 border-b border-gray-100 backdrop-blur'}`}>

        {/* LOGO & TEKS SIKARA (Teks dipaksa selalu muncul) */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <img src="/logo1.png" alt="Logo SIKaRa" className="h-9 w-auto object-contain" />
          <span className={`text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            SIKaRa
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-4">

          {/* TOMBOL TOGGLE THEME (SVG SUN/MOON) */}
          <button onClick={toggleTheme} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`} title="Ganti Tema">
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
            )}
          </button>

          {isLogged ? (
            <>
              <span className={`hidden md:block text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Halo, {userName}</span>

              <button onClick={handleLogout} className={`font-bold text-xs px-4 py-2 rounded-xl transition-colors ${isDarkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 hover:bg-red-100 text-red-500'}`}>
                Keluar
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className={`font-bold text-xs transition-colors ${isDarkMode ? 'text-slate-300 hover:text-blue-400' : 'text-slate-600 hover:text-blue-500'}`}>
                Masuk
              </button>
              <button onClick={() => navigate('/register')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-5 py-2 rounded-xl transition-colors shadow-md shadow-blue-500/20">
                Daftar Akun
              </button>
            </>
          )}
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <main className="max-w-6xl mx-auto w-full px-4 md:px-6 py-8 space-y-12 flex-1">

        <div className="text-center space-y-2">
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Sistem Informasi Karya Rancah
          </h1>
          <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
            Temukan komoditas dan hasil karya terbaik dari UMKM Kecamatan Rancah
          </p>
        </div>

        {/* SECTION A: LINGKARAN PROFIL UMKM (INISIAL TOKO) */}
        {/* SECTION A: LINGKARAN PROFIL UMKM */}
        <div className={`grid grid-cols-4 md:grid-cols-8 gap-4 justify-items-center p-6 rounded-2xl shadow-sm border transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
          {displayUmkm.map((umkm) => (
            <div key={umkm.id} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border shadow-sm transition-all flex items-center justify-center group-hover:scale-105 group-hover:ring-2 ring-blue-500/50 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-blue-50 border-blue-100 text-blue-500 group-hover:bg-blue-500 group-hover:text-white'}`}>

                {umkm.logo_url ? (
                  <img
                    src={umkm.logo_url}
                    alt={umkm.business_name}
                    className="w-full h-full object-cover bg-white"
                    onError={(e) => {
                      // Fallback kuat jika gambar gagal dimuat
                      e.target.onerror = null; // Mencegah looping error
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex'; // Tampilkan inisial huruf
                    }}
                  />
                ) : null}

                {/* Elemen Inisial (Tersembunyi secara default jika ada gambar, atau selalu tampil jika logo_url null) */}
                <span
                  className="text-xl md:text-2xl font-black uppercase flex items-center justify-center w-full h-full"
                  style={{ display: umkm.logo_url ? 'none' : 'flex' }}
                >
                  {umkm.business_name ? umkm.business_name.charAt(0) : '?'}
                </span>

              </div>
              <span className={`text-[10px] md:text-[11px] font-bold text-center line-clamp-1 w-16 group-hover:text-blue-500 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                {umkm.business_name}
              </span>
            </div>
          ))}
        </div>

        {/* SECTION B: ETALASE PRODUK */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Rekomendasi Pilihan</h2>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>Dukung usaha lokal dengan membeli produk karya anak bangsa</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.length === 0 ? (
              <div className={`col-span-full text-center py-12 text-sm font-medium ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                Belum ada produk yang dipublikasikan oleh mitra UMKM.
              </div>
            ) : (
              products.map((prod) => (
                <div key={prod.id} className={`rounded-2xl border shadow-sm p-3 md:p-4 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                  <div>
                    <div className={`w-full aspect-square rounded-xl mb-3 overflow-hidden flex items-center justify-center relative ${isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-50 text-gray-300'}`}>
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-50">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                      )}
                      <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold shadow-sm backdrop-blur-sm ${isDarkMode ? 'bg-slate-900/80 text-slate-300' : 'bg-white/90 text-slate-600'}`}>
                        {prod.category_name}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-400 mb-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-400">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                      </svg>
                      <span className={`font-bold ml-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{parseFloat(prod.rating).toFixed(1)}</span>
                      <span className={isDarkMode ? 'text-slate-500' : ''}>({prod.review_count})</span>
                    </div>

                    <h3 className={`font-bold text-xs md:text-sm line-clamp-2 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{prod.title}</h3>
                    <p className={`text-[9px] md:text-[10px] mt-1 mb-3 flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.5a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                      </svg>
                      {prod.business_name}
                    </p>
                  </div>

                  <div className={`pt-3 border-t flex flex-col gap-2 ${isDarkMode ? 'border-slate-700' : 'border-gray-50'}`}>
                    <span className={`font-extrabold text-sm md:text-base ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      Rp {parseFloat(prod.price).toLocaleString('id-ID')}
                    </span>
                    {/* 🔥 TOMBOL LIHAT DETAIL SEKARANG BIRU */}
                    <button
                      onClick={() => setSelectedProduct(prod)}
                      className={`w-full text-[10px] md:text-xs px-4 py-2.5 rounded-xl font-bold transition-colors shadow-sm shadow-blue-500/20 ${isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>

      {/* ========================================================= */}
      {/* 🔥 MODAL POPUP: DETAIL PRODUK & CHECKOUT PEMESANAN */}
      {/* ========================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
          <div className={`rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col md:flex-row relative max-h-[90vh] ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>

            <button onClick={() => setSelectedProduct(null)} className={`absolute top-4 right-4 z-10 p-2 rounded-full md:hidden shadow-sm backdrop-blur ${isDarkMode ? 'bg-slate-700/80 text-white' : 'bg-white/80 text-slate-800'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>

            <div className={`md:w-5/12 h-56 md:h-auto relative shrink-0 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
              {selectedProduct.image_url ? (
                <img src={selectedProduct.image_url} className="w-full h-full object-cover" alt="Detail" />
              ) : (
                <div className={`w-full h-full flex flex-col items-center justify-center font-bold text-sm gap-2 ${isDarkMode ? 'text-slate-500' : 'text-gray-300'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <span>Tanpa Gambar</span>
                </div>
              )}
            </div>

            <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">

                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-500'}`}>
                      {selectedProduct.category_name}
                    </span>
                    <h2 className={`text-xl md:text-2xl font-extrabold mt-2 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {selectedProduct.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5 ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.5a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                        </svg>
                        {selectedProduct.business_name}
                      </span>
                      <span className={`text-[10px] font-semibold flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-400">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                        {parseFloat(selectedProduct.rating).toFixed(1)} Terjual
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedProduct(null)} className={`hidden md:block transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-slate-800'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className={`text-xs leading-relaxed p-4 rounded-xl border ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                  <p>
                    Produk eksklusif dan berkualitas dari <strong>{selectedProduct.business_name}</strong>.
                    Dibuat dengan bahan pilihan dan ketelitian tinggi untuk memastikan kepuasan Anda.
                    Sangat cocok untuk memenuhi kebutuhan harian maupun acara spesial Anda. Tersedia terbatas, sisa stok: <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>{selectedProduct.stock} item</strong>.
                  </p>
                </div>

                <div className="pt-2">
                  <h3 className={`text-2xl font-extrabold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Rp {parseFloat(selectedProduct.price).toLocaleString('id-ID')}
                  </h3>
                </div>

                {/* Pilihan Metode Pengiriman (MURNI SVG) */}
                <div className="space-y-2 pt-2">
                  <label className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Opsi Pengiriman</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${deliveryMethod === 'Ambil Sendiri' ? (isDarkMode ? 'border-blue-400 bg-blue-500/20 text-blue-400 ring-1 ring-blue-400' : 'border-blue-500 bg-blue-50 text-blue-600 ring-1 ring-blue-500') : (isDarkMode ? 'border-slate-600 text-slate-400 hover:bg-slate-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                      <input type="radio" className="hidden" name="delivery" value="Ambil Sendiri" checked={deliveryMethod === 'Ambil Sendiri'} onChange={(e) => setDeliveryMethod(e.target.value)} />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                      <span className="text-[11px] font-extrabold text-center">Ambil di Lapak</span>
                    </label>

                    <label className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${deliveryMethod === 'Delivery Order' ? (isDarkMode ? 'border-blue-400 bg-blue-500/20 text-blue-400 ring-1 ring-blue-400' : 'border-blue-500 bg-blue-50 text-blue-600 ring-1 ring-blue-500') : (isDarkMode ? 'border-slate-600 text-slate-400 hover:bg-slate-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50')}`}>
                      <input type="radio" className="hidden" name="delivery" value="Delivery Order" checked={deliveryMethod === 'Delivery Order'} onChange={(e) => setDeliveryMethod(e.target.value)} />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                      <span className="text-[11px] font-extrabold text-center">Pesan Antar (COD)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={`pt-6 mt-4 border-t flex gap-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <button
                  onClick={handleProcessOrder}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                  Pesan Sekarang
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <footer className={`text-center p-5 text-[11px] font-medium border-t mt-12 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-gray-100 text-gray-400'}`}>
        &copy; 2026 Sistem Informasi Karya Rancah (SIKaRa). All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;