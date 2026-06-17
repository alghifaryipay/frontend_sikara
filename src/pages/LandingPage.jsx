import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from '../components/Icons'; // Import ikon SVG Bintang

const LandingPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Data Kategori dengan URL Image Web Sementara (Menggunakan placeholder gambar estetik)
  const categories = [
    { id: 1, name: 'Warung Sari', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=60' },
    { id: 2, name: 'Batik Sari', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=100&auto=format&fit=crop&q=60' },
    { id: 3, name: 'Dapur Lestari', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&auto=format&fit=crop&q=60' },
    { id: 4, name: 'Kopi Robusta', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&auto=format&fit=crop&q=60' },
    { id: 5, name: 'Kopi Toraja', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&auto=format&fit=crop&q=60' },
    { id: 6, name: 'Mutiara', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&auto=format&fit=crop&q=60' },
    { id: 7, name: 'Kerajinan', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=100&auto=format&fit=crop&q=60' },
    { id: 8, name: 'Tas Rotan', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=100&auto=format&fit=crop&q=60' },
  ];

  useEffect(() => {
    fetch('http://localhost:5000/api/public/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetch produk:', err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* NAVBAR UTAMA */}
      <nav className="bg-white border-b border-gray-100 p-4 px-12 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo1.png" alt="Logo SIKaRa" className="h-9 w-auto object-contain" />
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/login')} className="text-slate-600 hover:text-blue-500 font-medium text-sm transition-colors">
            Masuk
          </button>
          <button onClick={() => navigate('/register')} className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-5 py-2 rounded-xl transition-colors shadow-md shadow-blue-100">
            Daftar
          </button>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <main className="max-w-6xl mx-auto w-full px-6 py-8 space-y-12">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Sistem Informasi Karya Rancah</h1>
          <p className="text-sm text-gray-400 font-medium">UMKM Kecamatan Rancah</p>
        </div>

        {/* SECTION A: LINGKARAN KATEGORI MENGGUNAKAN IMAGE WEB */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 justify-items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          {categories.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100 shadow-sm group-hover:border-blue-500 transition-all group-hover:scale-105">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover"
                  // Fallback jika internet mati / gambar tidak ke-load
                  onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Shop' }} 
                />
              </div>
              <span className="text-[11px] font-medium text-gray-600 group-hover:text-blue-500 text-center line-clamp-1 w-16">
                {cat.name}
              </span>
            </div>
          ))}
        </div>

        {/* SECTION B: REKOMENDASI PRODUK */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-slate-800">Rekomendasi Produk</h2>
            <p className="text-xs text-gray-400">Dukung usaha UMKM lokal dan temukan produk Indonesia asli</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400 text-sm">
                Belum ada data produk di database. Silakan isi produk lewat database atau dashboard nanti.
              </div>
            ) : (
              products.map((prod) => (
                <div key={prod.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-full h-48 bg-slate-100 rounded-xl mb-3 overflow-hidden flex items-center justify-center text-gray-400">
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                      ) : (
                        <span>📸 No Image</span>
                      )}
                    </div>
                    
                    {/* Menggunakan StarIcon SVG Baru */}
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                      <StarIcon className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="font-semibold text-slate-700 ml-0.5">{parseFloat(prod.rating).toFixed(1)}</span>
                      <span>({prod.review_count} ulasan)</span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{prod.title}</h3>
                    <p className="text-[11px] text-gray-400 mb-4">{prod.business_name}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <span className="font-extrabold text-blue-600 text-base">
                      Rp {parseFloat(prod.price).toLocaleString('id-ID')}
                    </span>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-lg font-medium transition-colors">
                      Lihat
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>

      <footer className="text-center p-4 text-xs text-gray-400 bg-white border-t border-gray-100 mt-12">
        &copy; 2026 SIKaRa Rancah. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;