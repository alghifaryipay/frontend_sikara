import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UmkmLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState({ name: 'Pemilik Usaha', email: 'mitra@umkm.com', shopName: 'Toko Saya' });

  useEffect(() => {
    const storedName = localStorage.getItem('name') || 'Warung Sari';
    const storedEmail = localStorage.getItem('email') || 'alghifaryy518@gmail.com';
    const savedUserId = localStorage.getItem('userId');

    if (savedUserId && savedUserId !== 'undefined') {
      fetch(`http://localhost:5000/api/umkm/dashboard-full/${savedUserId}`)
        .then((res) => res.json())
        .then((data) => {
          setProfile({ name: storedName, email: storedEmail, shopName: data.businessName });
        })
        .catch(() => setProfile({ name: storedName, email: storedEmail, shopName: 'Warung Sari' }));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/umkm/dashboard',
      name: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      )
    },
    {
    path: '/umkm/kasir',
    name: 'Kasir (POS)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5M5.25 4.5V18a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25V4.5m-10.5 6h7.5M9 13.5h5.25" />
      </svg>
    )
    },
    {
      path: '/umkm/produk',
      name: 'Produk Saya',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      )
    },
    {
      path: '/umkm/laporan',
      name: 'Laporan Penjualan',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans antialiased w-full">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 fixed h-full z-40 print:hidden">
        <div className="space-y-8">
          <div className="flex items-center gap-2.5 pl-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo1.png" alt="Logo SIKaRa" className="h-8 w-auto object-contain" />
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-tight leading-none">{profile.shopName}</h2>
              <p className="text-[10px] text-gray-400 font-medium mt-1">Dashboard UMKM</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-400 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <button onClick={handleLogout} className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-semibold text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Keluar
        </button>
      </aside>

      {/* CONTENT AREA */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen print:pl-0 w-full">
        <header className="h-16 bg-white border-b border-slate-100 px-10 flex justify-end items-center fixed right-0 left-64 top-0 bg-white/80 backdrop-blur-md z-30 print:hidden">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h4 className="text-xs font-bold text-slate-800">{profile.name}</h4>
              <p className="text-[10px] text-gray-400 font-medium">{profile.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>
        </header>

        {/* CSS Flex item-center dan print:max-w untuk mematikan pergeseran kanan */}
        <main className="pt-24 p-8 flex-1 max-w-[1200px] w-full mx-auto print:pt-0 print:p-0 print:max-w-full print:mx-auto flex flex-col items-center">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UmkmLayout;