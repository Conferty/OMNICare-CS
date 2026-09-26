import React, { useState } from 'react';
import { CustomDomainConfig } from '../types';
import { Settings, Save, Sparkles, BookOpen } from 'lucide-react';

interface CustomDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: CustomDomainConfig;
  onSaveConfig: (config: CustomDomainConfig) => void;
}

export const CustomDomainModal: React.FC<CustomDomainModalProps> = ({
  isOpen,
  onClose,
  initialConfig,
  onSaveConfig
}) => {
  const [companyName, setCompanyName] = useState(
    initialConfig?.companyName || 'Toko Kopi Aroma Senja'
  );
  const [businessType, setBusinessType] = useState(
    initialConfig?.businessType || 'Kafe & Roastery Kopi Spesialti'
  );
  const [knowledgeText, setKnowledgeText] = useState(
    initialConfig?.knowledgeText ||
      `Toko Kopi Aroma Senja:
- Buka setiap hari pukul 08.00 - 22.00 WIB.
- Menu Unggulan: Kopi Susu Senja (Rp 22.000), V60 Single Origin Gayo/Toraja (Rp 28.000), Croissant Almond (Rp 25.000).
- Fasilitas: WiFi kecepatan 100 Mbps, colokan listrik di setiap meja, smoking area rooftop, musholla bersih.
- Pembayaran: QRIS, GoPay, OVO, ShopeePay, Kartu Debit/Kredit (tanpa surcharge).
- Pemesanan Online: Melalui GoFood, GrabFood, atau pickup mandiri dengan diskon 15%.`
  );

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      companyName,
      businessType,
      knowledgeText,
      faqs: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Konfigurasi Basis Pengetahuan Kustom</h3>
              <p className="text-xs text-slate-400">
                Atur brand, daftar produk, jam operasional, dan FAQ bisnis Anda sendiri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Nama Bisnis / Brand</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="Contoh: Toko Kopi Aroma Senja"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Kategori / Bidang Usaha</label>
            <input
              type="text"
              required
              value={businessType}
              onChange={e => setBusinessType(e.target.value)}
              placeholder="Contoh: Kafe & Roastery Kopi Spesialti"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
              <span>Basis Pengetahuan & Info Bisnis (FAQ / Menu / Kebijakan)</span>
              <span className="text-[10px] text-slate-500">Makin detail makin akurat bot menjawab</span>
            </label>
            <textarea
              rows={8}
              required
              value={knowledgeText}
              onChange={e => setKnowledgeText(e.target.value)}
              placeholder="Tuliskan info jam operasional, daftar menu/layanan, harga, kebijakan komplain, nomor CS darurat..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition flex items-center justify-center gap-1.5 shadow-md shadow-violet-600/20"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan & Aktifkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
