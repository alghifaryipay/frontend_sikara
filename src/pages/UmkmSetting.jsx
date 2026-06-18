import React, { useState, useEffect } from 'react';
import UmkmLayout from '../components/UmkmLayout';

const UmkmSetting = () => {
  const userId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(true);

  // State untuk menyimpan file fisik dari PC
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    business_name: '',
    owner_name: '',
    phone: '',
    location: '',
    category: '',
    logo_url: ''
  });

  useEffect(() => {
    // Ambil data profil UMKM
    fetch(`https://backend-sikara.onrender.com/api/umkm/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          business_name: data.business_name || '',
          owner_name: data.owner_name || '',
          phone: data.phone || '',
          location: data.location || '',
          category: data.category || '',
          logo_url: data.logo_url || ''
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error load profile:', err);
        setLoading(false);
      });

    fetch(`https://backend-sikara.onrender.com/api/admin/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error('Error load categories:', err));
  }, [userId]);

  // Fungsi mendeteksi file yang dipilih dari PC
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Buat URL pratinjau (preview) sementara untuk ditampilkan di kotak logo
      setFormData({ ...formData, logo_url: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalLogoUrl = formData.logo_url;

    // 🔥 JIKA USER MEMILIH FILE DARI PC, UPLOAD DULU GAMBARNYA!
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
          finalLogoUrl = uploadResult.imageUrl; // Dapatkan link permanen dari folder backend
        } else {
          alert('Gagal mengupload gambar ke server.');
          return;
        }
      } catch (err) {
        console.error('Error upload:', err);
        alert('Server gagal memproses gambar.');
        return;
      }
    }

    // Lanjutkan simpan teks data profil (SEKARANG LOGO IKUT DIKIRIM)
    fetch(`https://backend-sikara.onrender.com/api/umkm/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_name: formData.business_name,
        owner_name: formData.owner_name,
        phone: formData.phone,
        location: formData.location,
        category: formData.category,
        logo_url: finalLogoUrl // 👈 INI KUNCI UTAMANYA!
      })
    })
      .then((res) => {
        if (res.ok) {
          localStorage.setItem('businessName', formData.business_name);
          localStorage.setItem('logoUrl', finalLogoUrl); // Simpan link gambar akhir

          alert('Pengaturan profil toko berhasil diperbarui!');
          window.location.reload();
        } else {
          alert('Gagal memperbarui profil toko.');
        }
      })
      .catch((err) => console.error('Error updating profile:', err));
  };

  if (loading) {
    return (
      <UmkmLayout>
        <div className="text-center py-10 text-xs text-gray-400 animate-pulse">Memuat konfigurasi lapak...</div>
      </UmkmLayout>
    );
  }

  return (
    <UmkmLayout>
      <div className="max-w-2xl bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Pengaturan Toko</h1>
          <p className="text-xs text-gray-400 mt-0.5">Kelola identitas branding dan data operasional UMKM Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 uppercase tracking-wider text-[10px] mb-1">Nama Usaha / Toko</label>
              <input
                type="text"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white text-slate-800 font-bold text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-500 uppercase tracking-wider text-[10px] mb-1">Nama Pemilik</label>
              <input
                type="text"
                value={formData.owner_name}
                onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white text-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 uppercase tracking-wider text-[10px] mb-1">No. WhatsApp / Telepon</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white text-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-500 uppercase tracking-wider text-[10px] mb-1">Kategori Sektor Usaha</label>
              {/* 🔥 TAMBAHAN 3: Input teks diubah menjadi Dropdown Select */}
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white text-slate-800 text-xs cursor-pointer"
              >
                <option value="" disabled>Pilih Kategori Usaha...</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 uppercase tracking-wider text-[10px] mb-1">Alamat Lengkap Lapak</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white text-slate-800 text-xs"
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100/70 space-y-3">
            <h4 className="text-slate-700 font-bold text-[11px] uppercase tracking-wider">Kustomisasi Gambar Logo</h4>
            <div className="flex gap-5 items-center">
              <div className="w-16 h-16 bg-white border rounded-xl overflow-hidden shadow-sm flex items-center justify-center shrink-0">
                <img
                  src={formData.logo_url || '/logo1.png'}
                  alt="Preview Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/logo1.png'; }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-400 text-[10px] mb-1.5">Pilih file gambar (JPG/PNG) dari komputer Anda</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-slate-500 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t border-slate-50">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md shadow-blue-100"
            >
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </UmkmLayout>
  );
};

export default UmkmSetting;