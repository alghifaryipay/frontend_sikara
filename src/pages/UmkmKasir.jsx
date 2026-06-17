import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UmkmLayout from '../components/UmkmLayout';

const UmkmKasir = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  
  const [products, setProducts] = useState([]);
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(true);

  // State Pilihan Item Aktif di Form
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  // REVISI UTAMA: State Keranjang Belanja (Array Multi-Item)
  const [cart, setCart] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  // State Cetak Struk Nota
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    if (!userId || userId === 'undefined') {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:5000/api/umkm/products/${userId}`)
      .then((res) => res.json())
      .then((resData) => {
        setBusinessName(resData.businessName || 'Toko UMKM');
        setProducts(resData.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal sinkronisasi data produk kasir:", err);
        setLoading(false);
      });
  }, [userId, navigate]);

  // Hitung ulang Grand Total belanjaan setiap kali isi keranjang (cart) berubah
  useEffect(() => {
    const totalSemua = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    setGrandTotal(totalSemua);
  }, [cart]);

  const handleProductSelection = (e) => {
    const productName = e.target.value;
    setSelectedProduct(productName);
    const matchProduct = products.find(p => p.title === productName);
    setPrice(matchProduct ? parseFloat(matchProduct.price) : 0);
  };

  // Fungsi 1: Masukkan Barang dari Form ke Keranjang Sementara
  const handleTambahKeKeranjang = (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert('Silakan pilih produk terlebih dahulu!');
      return;
    }

    // Cek apakah barang tersebut sudah ada di keranjang
    const existingItemIdx = cart.findIndex(item => item.product_name === selectedProduct);

    if (existingItemIdx > -1) {
      // Jika sudah ada, akumulasikan kuantitasnya saja
      const updatedCart = [...cart];
      updatedCart[existingItemIdx].quantity += parseInt(quantity);
      setCart(updatedCart);
    } else {
      // Jika barang baru, masukkan objek baru ke dalam array keranjang
      const newItem = {
        product_name: selectedProduct,
        quantity: parseInt(quantity),
        price: price
      };
      setCart([...cart, newItem]);
    }

    // Reset Form Pilihan agar kasir bisa langsung memilih item kedua
    setSelectedProduct('');
    setQuantity(1);
    setPrice(0);
  };

  // Fungsi 2: Hapus salah satu item dari keranjang belanja jika batal
  const handleHapusItemKeranjang = (index) => {
    const filteredCart = cart.filter((_, i) => i !== index);
    setCart(filteredCart);
  };

  // Fungsi 3: Kirim Seluruh Isi Keranjang Sekaligus ke Database
  const handleCheckoutKasir = () => {
    if (cart.length === 0) {
      alert('Keranjang belanja masih kosong!');
      return;
    }

    const currentUmkmId = products[0]?.umkm_id;

    const payload = {
      umkm_id: currentUmkmId,
      items: cart // 🔥 Mengirimkan seluruh array belanjaan sekaligus!
    };

    fetch('http://localhost:5000/api/umkm/orders-manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((resData) => {
        // Terbitkan struk belanja dengan daftar item lengkap
        setReceiptData({
          noInvoice: 'SIK-' + Date.now().toString().slice(-6),
          tanggal: new Date().toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          items: cart,
          totalBayar: grandTotal
        });
        setShowReceipt(true);
        setCart([]); // Kosongkan keranjang kembali setelah sukses
      })
      .catch((err) => console.error("Gagal simpan transaksi kasir:", err));
  };

  if (loading) return <UmkmLayout><div className="p-10 text-center text-xs text-gray-400 animate-pulse">Menyiapkan terminal kasir multi-item...</div></UmkmLayout>;

  return (
    <UmkmLayout>
      <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SISI KIRI: INPUT FORM & TABEL KERANJANG (Bobot: 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* FORM PENAMBAHAN ITEM */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Mesin Kasir Multi-Item</h1>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">Tambahkan beberapa jenis produk sekaligus ke dalam satu nota belanja</p>
            </div>

            <form onSubmit={handleTambahKeKeranjang} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Produk Etalase</label>
                <select
                  value={selectedProduct}
                  onChange={handleProductSelection}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="">-- Pilih Produk --</option>
                  {products.map((prod, idx) => (
                    <option key={idx} value={prod.title}>{prod.title} (Rp {parseFloat(prod.price).toLocaleString('id-ID')})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Qty</label>
                <input
                  type="number" min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                />
              </div>

              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Masukkan
              </button>
            </form>
          </div>

          {/* TABEL LIST BELANJAAN KERANJANG SEMENTARA */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Keranjang Belanja Pelanggan</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-4 pl-6">Nama Produk</th>
                    <th className="p-4 text-center">Jumlah</th>
                    <th className="p-4">Harga Satuan</th>
                    <th className="p-4">Subtotal</th>
                    <th className="p-4 text-center">Batal</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-600 divide-y divide-slate-50 font-medium">
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-gray-400 font-medium">Keranjang kosong. Pilih barang di atas lalu klik Masukkan.</td>
                    </tr>
                  ) : (
                    cart.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6 font-bold text-slate-800">{item.product_name}</td>
                        <td className="p-4 text-center font-bold text-slate-700 bg-slate-50/40">{item.quantity} pcs</td>
                        <td className="p-4">Rp {item.price.toLocaleString('id-ID')}</td>
                        <td className="p-4 font-bold text-blue-600">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleHapusItemKeranjang(idx)} className="text-gray-300 hover:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* FOOTER TOTAL CO */}
            {cart.length > 0 && (
              <div className="p-5 bg-slate-50 flex justify-between items-center border-t border-slate-100">
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Pembayaran Kasir</p>
                  <h2 className="text-xl font-extrabold text-slate-900">Rp {grandTotal.toLocaleString('id-ID')}</h2>
                </div>
                <button onClick={handleCheckoutKasir} className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md shadow-blue-100 flex items-center gap-2 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Simpan Transaksi & Cetak Nota
                </button>
              </div>
            )}
          </div>

        </div>

        {/* SISI KANAN: PREVIEW STRUK THERMAL MULTI-ITEM (Bobot: 4) */}
        <div className="lg:col-span-4">
          {showReceipt && receiptData ? (
            <div className="space-y-4 sticky top-24">
              <div id="thermal-receipt" className="bg-white p-5 border border-slate-200 shadow-md font-mono text-[11px] text-slate-800 space-y-4 max-w-[290px] mx-auto">
                <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
                  <h3 className="text-xs font-bold uppercase">{businessName}</h3>
                  <p className="text-[9px] text-gray-400 font-medium">SIKaRa POS — Struk Belanja</p>
                </div>

                <div className="space-y-0.5 text-gray-400 text-[10px]">
                  <p>Nota : {receiptData.noInvoice}</p>
                  <p>Tgl  : {receiptData.tanggal}</p>
                </div>

                {/* LOOPING ITEM DI STRUK BELANJA */}
                <div className="border-b border-dashed border-slate-300 py-1 divide-y divide-dashed divide-slate-100">
                  {receiptData.items.map((item, i) => (
                    <div key={i} className="py-1.5 first:pt-0 last:pb-0">
                      <p className="font-bold text-slate-900">{item.product_name}</p>
                      <div className="flex justify-between text-gray-500 text-[10px] mt-0.5">
                        <span>{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</span>
                        <span className="font-bold text-slate-800">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-extrabold text-sm text-slate-950 pt-1">
                  <span>TOTAL BILL:</span>
                  <span>Rp {receiptData.totalBayar.toLocaleString('id-ID')}</span>
                </div>

                <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[9px] text-gray-400">
                  <p>*** TERIMA KASIH ***</p>
                  <p>Sudah Belanja di Toko Kami</p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const printArea = document.getElementById('thermal-receipt').innerHTML;
                    document.body.innerHTML = printArea;
                    window.print();
                    window.location.reload();
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0a2.25 2.25 0 0 1-2.25 2.25H8.59A2.25 2.25 0 0 1 6.34 18m11.32 0h-11.32M19.5 12h.008v.008H19.5V12Zm-.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM18 12V6.75A2.25 2.25 0 0 0 15.75 4.5H8.25A2.25 2.25 0 0 0 6 6.75V12m12 0H6" /></svg>
                  Cetak Nota Thermal
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-gray-400 bg-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-8 h-8 text-slate-300 mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75 2.25 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 2.24a4.5 4.5 0 1 1 9.01 0c-.028.391.217.76.612.79A48.242 48.242 0 0 1 21 7.5a1.5 1.5 0 0 1-1.5 1.5H15a1.5 1.5 0 0 1-1.5-1.5c0-.622-.435-1.157-1.047-1.26a48.094 48.094 0 0 0-1.1-.087M1.5 7.5A1.5 1.5 0 0 1 3 6h3.108a2.25 2.25 0 0 1 2.192 1.977l.218 2.62c.036.435.39.76.825.76h1.16a.75.75 0 0 1 0 1.5H9.344a2.25 2.25 0 0 1-2.23-2.062l-.218-2.62a.75 2.25 0 0 0-.73-.658H3a.75 2.25 0 0 0-.75.75v12A1.5 1.5 0 0 0 4.5 22.5h11a1.5 1.5 0 0 0 1.5-1.5v-2.25" /></svg>
              <p className="text-[11px] font-medium leading-relaxed">Struk thermal akan terbit otomatis di sini setelah Anda menyimpan transaksi.</p>
            </div>
          )}
        </div>

      </div>
    </UmkmLayout>
  );
};

export default UmkmKasir;