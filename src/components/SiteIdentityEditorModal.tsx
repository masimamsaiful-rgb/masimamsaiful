import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Globe, 
  Wrench, 
  Cpu, 
  Laptop, 
  Shield, 
  Zap, 
  Flame, 
  Smartphone, 
  Server, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Megaphone, 
  FileText, 
  ExternalLink,
  Crown,
  Eye,
  Sliders,
  Check
} from 'lucide-react';
import { SiteSettings } from '../data/defaultGuides';
import { UserActivityLog } from '../data/authTypes';

interface SiteIdentityEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  onSaveSettings: (settings: SiteSettings) => void;
  onRecordActivity?: (action: UserActivityLog['action'], details: string) => void;
}

interface IdentityPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<SiteSettings>;
}

const PRESETS: IdentityPreset[] = [
  {
    id: 'meja-servis',
    name: 'Meja Servis Pro',
    description: 'Format teknisi laptop, printer & jaringan komputer standar teruji',
    icon: 'Wrench',
    settings: {
      siteName: 'Meja Servis',
      tagline: 'Solusi dari teknisi, bukan sekadar teori',
      subtitle: 'Koleksi panduan perbaikan laptop, printer, dan jaringan komputer teruji langsung di meja servis. Dilengkapi dengan panel kelola konten (CMS) termudah.',
      logoInitial: 'M',
      logoIcon: 'Wrench',
      brandBadge: 'PRO',
      brandBadgeColor: 'amber',
      showAnnouncement: true,
      announcementText: '⚡ Layanan Konsultasi Cepat Teknisi Aktif: Tanya jawab diagnosa kerusakan laptop & printer via WhatsApp!',
      announcementColor: 'amber',
      whatsappMessage: 'Halo Meja Servis, saya mau konsultasi masalah kerusakan perangkat saya: ',
      operatingHours: 'Senin - Sabtu: 08.30 - 21.00 WIB',
    }
  },
  {
    id: 'dokter-gadget',
    name: 'Dokter Gadget & Laptop',
    description: 'Spesialis servis hardware cepat, upgrade SSD/RAM & reparasi motherboard',
    icon: 'Laptop',
    settings: {
      siteName: 'Dokter Gadget & PC',
      tagline: 'Pusat reparasi motherboard, upgrade & servis kilat',
      subtitle: 'Diagnosa akurat dan panduan perbaikan hardware laptop gaming, notebook, hingga MacBook oleh teknisi berpengalaman.',
      logoInitial: 'DG',
      logoIcon: 'Laptop',
      brandBadge: 'OFFICIAL',
      brandBadgeColor: 'emerald',
      showAnnouncement: true,
      announcementText: '🎉 Promo Upgrade SSD & Pembersihan Thermal Pasta Diskon 20% Minggu Ini!',
      announcementColor: 'emerald',
      whatsappMessage: 'Halo Dokter Gadget, saya ingin tanya biaya servis laptop: ',
      operatingHours: 'Setiap Hari: 09.00 - 22.00 WIB',
    }
  },
  {
    id: 'bengkel-printer',
    name: 'Klinik Printer & Hardware',
    description: 'Fokus perbaikan head printer, blinking error, reset waste inkpad & infus',
    icon: 'Cpu',
    settings: {
      siteName: 'Klinik Printer Mandiri',
      tagline: 'Solusi head mampet, blinking & infus cartridge',
      subtitle: 'Database langkah perbaikan printer Epson, Canon, HP & Brother terlengkap. Solusi mandiri tanpa harus bawa ke tukang servis.',
      logoInitial: 'KP',
      logoIcon: 'Cpu',
      brandBadge: 'EXPERT',
      brandBadgeColor: 'blue',
      showAnnouncement: true,
      announcementText: '🖨️ Tutorial reset printer blinking dan penanganan paper jam terlengkap sudah diupdate!',
      announcementColor: 'blue',
      whatsappMessage: 'Halo Klinik Printer, printer saya mengalami masalah error: ',
      operatingHours: 'Senin - Jumat: 08.00 - 17.00 WIB',
    }
  },
  {
    id: 'it-support-lab',
    name: 'IT Support & Network Lab',
    description: 'Panduan konfigurasi Mikrotik, Wi-Fi kantor, kabel LAN & server',
    icon: 'Server',
    settings: {
      siteName: 'Network & IT Lab',
      tagline: 'Infrastruktur jaringan, router & keamanan sistem',
      subtitle: 'Dokumentasi teknis troubleshooting jaringan kantor, crimping kabel LAN, manajemen bandwidth router, dan troubleshooting koneksi internet.',
      logoInitial: 'IT',
      logoIcon: 'Server',
      brandBadge: 'ENTERPRISE',
      brandBadgeColor: 'purple',
      showAnnouncement: true,
      announcementText: '🌐 Dokumentasi konfigurasi firewall & hotspot Mikrotik telah ditambahkan.',
      announcementColor: 'purple',
      whatsappMessage: 'Halo IT Support Lab, saya butuh bantuan konsultasi setup jaringan kantor: ',
      operatingHours: '24/7 Monitoring & Support',
    }
  }
];

export const SiteIdentityEditorModal: React.FC<SiteIdentityEditorModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onRecordActivity,
}) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'announcement' | 'contact' | 'footer' | 'presets'>('general');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync with prop when opened
  useEffect(() => {
    if (isOpen) {
      setFormData(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: IdentityPreset) => {
    const updated: SiteSettings = {
      ...formData,
      ...preset.settings,
    };
    setFormData(updated);
    if (onRecordActivity) {
      onRecordActivity('edit_guide', `Menerapkan template identitas situs: "${preset.name}"`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setShowSavedToast(true);
    if (onRecordActivity) {
      onRecordActivity('edit_guide', `Memperbarui identitas situs: "${formData.siteName}"`);
    }
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 800);
  };

  const renderLogoIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'Laptop': return <Laptop className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'Smartphone': return <Smartphone className="w-4 h-4" />;
      case 'Server': return <Server className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Crown': return <Crown className="w-4 h-4" />;
      default: return <Wrench className="w-4 h-4" />;
    }
  };

  const badgeColorClasses: Record<string, string> = {
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    rose: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    slate: 'bg-slate-700/60 text-slate-300 border-slate-600',
  };

  const announcementBgClasses: Record<string, string> = {
    amber: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    emerald: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    blue: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
    purple: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-lg text-white">
                  Tool Edit Identitas & Tampilan Web
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  PRO BUILDER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ubah nama website, deskripsi, logo, banner promo, dan kontak dengan pratinjau langsung
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Terapkan & Simpan</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Visual Preview Bar (Seperti CMS Web Berbayar) */}
        <div className="bg-slate-950 text-white p-4 border-b border-slate-800 shrink-0 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Eye className="w-3.5 h-3.5" />
              <span>LIVE PREVIEW SIMULATOR:</span>
            </span>
            <span className="text-slate-400">Otomatis berubah saat Anda mengetik</span>
          </div>

          {/* Simulated Announcement Bar */}
          {formData.showAnnouncement && formData.announcementText && (
            <div className={`px-3 py-1.5 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all ${announcementBgClasses[formData.announcementColor || 'amber'] || announcementBgClasses.amber}`}>
              <div className="flex items-center gap-2 truncate">
                <Megaphone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{formData.announcementText}</span>
              </div>
              <span className="text-[10px] opacity-75 font-mono shrink-0">Banner Aktif</span>
            </div>
          )}

          {/* Simulated Header Navbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold font-serif text-lg flex items-center justify-center shadow-xs">
                {formData.logoInitial || 'M'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-white text-base tracking-tight">
                    {formData.siteName || 'Nama Website'}
                  </span>
                  {formData.brandBadge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold border uppercase ${badgeColorClasses[formData.brandBadgeColor || 'amber'] || badgeColorClasses.amber}`}>
                      {formData.brandBadge}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-xs sm:max-w-md">
                  {formData.tagline || 'Tagline slogan website'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700/80 text-[11px] flex items-center gap-1.5">
                {renderLogoIcon(formData.logoIcon)}
                <span>Ikon: {formData.logoIcon || 'Wrench'}</span>
              </div>
              <div className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 rounded-lg border border-emerald-500/30 text-[11px] flex items-center gap-1">
                <MessageCircle className="w-3 h-3 text-emerald-400" />
                <span>WA Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 flex items-center gap-1.5 sm:gap-2 overflow-x-auto shrink-0 py-2">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'general'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            <span>Nama & Deskripsi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('announcement')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'announcement'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-sky-600" />
            <span>Banner Promo</span>
            {formData.showAnnouncement && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kontak & Jam Kerja</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('footer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'footer'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>Footer & Legal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>1-Klik Template</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* TAB 1: IDENTITAS & DESKRIPSI */}
          {activeTab === 'general' && (
            <div className="space-y-5 max-w-3xl">
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Kustomisasi Identitas Website Utama</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Perubahan nama website dan deskripsi di sini akan langsung tampil pada bilah navigasi atas (Navbar), tajuk banner utama (Hero), tab browser, dan meta deskripsi situs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Site Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nama Website (Brand Name) *
                  </label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    placeholder="Contoh: Meja Servis"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Nama yang ditampilkan di logo header, footer, dan tab browser.
                  </span>
                </div>

                {/* Tagline */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tagline / Slogan Singkat
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Contoh: Solusi dari teknisi, bukan sekadar teori"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Motto singkat yang muncul di bawah logo atau judul web.
                  </span>
                </div>

                {/* Subtitle / Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Deskripsi Lengkap / Subtitle Hero *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Koleksi panduan perbaikan laptop, printer, dan jaringan komputer..."
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 leading-relaxed"
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Paragraf deskripsi yang tampil di banner utama halaman depan (Hero section).
                  </span>
                </div>

                {/* Logo Initial */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Huruf Inisial Logo (Kotak Kuning)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.logoInitial || 'M'}
                    onChange={(e) => setFormData({ ...formData, logoInitial: e.target.value.toUpperCase() })}
                    placeholder="M"
                    className="w-full px-3.5 py-2 text-sm font-serif font-bold text-center bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    1-3 karakter inisial (misal: "M", "MS", "DG")
                  </span>
                </div>

                {/* Logo Icon */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Ikon Representasi Logo
                  </label>
                  <select
                    value={formData.logoIcon || 'Wrench'}
                    onChange={(e) => setFormData({ ...formData, logoIcon: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 cursor-pointer focus:outline-none"
                  >
                    <option value="Wrench">🔧 Kunci Pas (Wrench - Teknisi Servis)</option>
                    <option value="Laptop">💻 Laptop & Notebook</option>
                    <option value="Cpu">⚡ Chipset & Komponen (Cpu)</option>
                    <option value="Shield">🛡️ Keamanan & Perlindungan (Shield)</option>
                    <option value="Server">🌐 Server & Jaringan Komputer</option>
                    <option value="Smartphone">📱 Smartphone & Gadget</option>
                    <option value="Zap">⚡ Kilat / Servis Cepat (Zap)</option>
                    <option value="Flame">🔥 Spesialis Populer (Flame)</option>
                    <option value="Crown">👑 Mahkota Premium (Crown)</option>
                    <option value="Sparkles">✨ Pro & Modern (Sparkles)</option>
                  </select>
                </div>

                {/* Brand Badge Label */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Teks Badge Brand (Header)
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={formData.brandBadge || 'PRO'}
                    onChange={(e) => setFormData({ ...formData, brandBadge: e.target.value.toUpperCase() })}
                    placeholder="PRO, OFFICIAL, VIP..."
                    className="w-full px-3.5 py-2 text-sm font-mono font-bold bg-white border border-slate-300 rounded-xl text-amber-700 focus:outline-none"
                  />
                </div>

                {/* Brand Badge Color */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Warna Badge Brand
                  </label>
                  <select
                    value={formData.brandBadgeColor || 'amber'}
                    onChange={(e) => setFormData({ ...formData, brandBadgeColor: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 cursor-pointer focus:outline-none"
                  >
                    <option value="amber">Emas / Amber (Elegan)</option>
                    <option value="emerald">Hijau / Emerald (Terpercaya)</option>
                    <option value="rose">Merah / Rose (Tegas)</option>
                    <option value="purple">Ungu / Purple (Eksklusif)</option>
                    <option value="blue">Biru / Sky (Teknologi)</option>
                    <option value="slate">Abu-abu / Slate (Minimalis)</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: BANNER PENGUMUMAN (ANNOUNCEMENT) */}
          {activeTab === 'announcement' && (
            <div className="space-y-5 max-w-3xl">
              <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-sky-900 flex items-center gap-1.5 mb-1">
                  <Megaphone className="w-4 h-4 text-sky-600" />
                  <span>Banner Pengumuman & Promo Puncak (Top Bar)</span>
                </div>
                <p className="text-xs text-sky-800 leading-relaxed">
                  Fitur ini menampilkan bilah informasi promo, pengumuman servis, atau diskon khusus di bagian paling atas website publik (seperti toko online dan web komersil berbayar).
                </p>
              </div>

              {/* Toggle Enable */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-slate-900">Aktifkan Banner Pengumuman di Atas</div>
                  <div className="text-[11px] text-slate-500">Tampilkan pita informasi promo di atas header utama</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showAnnouncement ?? true}
                    onChange={(e) => setFormData({ ...formData, showAnnouncement: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {/* Banner Text */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Teks Pengumuman / Promo *
                </label>
                <textarea
                  rows={2}
                  value={formData.announcementText || ''}
                  onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                  placeholder="Contoh: ⚡ Layanan Konsultasi Cepat Teknisi Aktif: Tanya jawab diagnosa kerusakan laptop & printer via WhatsApp!"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              {/* Banner Color */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Skema Warna Banner
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'amber', label: 'Emas (Promo)', bg: 'bg-amber-100 border-amber-300 text-amber-900' },
                    { id: 'emerald', label: 'Hijau (Aktif/Online)', bg: 'bg-emerald-100 border-emerald-300 text-emerald-900' },
                    { id: 'blue', label: 'Biru (Info Baru)', bg: 'bg-sky-100 border-sky-300 text-sky-900' },
                    { id: 'purple', label: 'Ungu (VIP/Spesial)', bg: 'bg-purple-100 border-purple-300 text-purple-900' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, announcementColor: c.id as any })}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        (formData.announcementColor || 'amber') === c.id
                          ? `${c.bg} ring-2 ring-amber-500 font-bold shadow-xs`
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Link Target (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Tautan Klik Banner (Opsional URL)
                </label>
                <input
                  type="url"
                  value={formData.announcementLink || ''}
                  onChange={(e) => setFormData({ ...formData, announcementLink: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Kosongkan jika banner hanya untuk dibaca dan tidak perlu diklik.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: KONTAK & JAM KERJA */}
          {activeTab === 'contact' && (
            <div className="space-y-5 max-w-3xl">
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5 mb-1">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Integrasi WhatsApp, Kontak & Jam Operasional</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Pengunjung yang ingin berkonsultasi langsung atau memesan jasa servis akan diarahkan ke kontak WhatsApp ini dengan pesan otomatis.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* WhatsApp Number */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nomor WhatsApp Teknisi / Admin *
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="Contoh: 6281234567890 (Gunakan kode 62 tanpa spasi atau +)"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Gunakan format internasional Indonesia (misal: 6281234567890).
                  </span>
                </div>

                {/* WhatsApp Message */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Awalan Pesan Otomatis Chat WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappMessage}
                    onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                    placeholder="Halo Meja Servis, saya mau konsultasi masalah kerusakan perangkat saya: "
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>

                {/* Email Support */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Email Resmi Dukungan (Opsional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={formData.contactEmail || ''}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="support@mejaservis.id"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Operating Hours */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Jam Operasional Servis
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.operatingHours || ''}
                      onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                      placeholder="Senin - Sabtu: 08.30 - 21.00 WIB"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: FOOTER & LEGAL */}
          {activeTab === 'footer' && (
            <div className="space-y-5 max-w-3xl">
              <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-purple-900 flex items-center gap-1.5 mb-1">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Catatan Kaki (Disclaimer & Hak Cipta)</span>
                </div>
                <p className="text-xs text-purple-800 leading-relaxed">
                  Teks disclaimer keselamatan teknisi dan informasi hak cipta yang muncul di bagian paling bawah halaman website publik.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Catatan Kaki / Disclaimer Keselamatan Teknisi
                </label>
                <textarea
                  rows={3}
                  value={formData.footerDisclaimer}
                  onChange={(e) => setFormData({ ...formData, footerDisclaimer: e.target.value })}
                  placeholder="Ikuti langkah dengan hati-hati. Jika ragu membongkar perangkat..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Teks Hak Cipta (Copyright Notice)
                </label>
                <input
                  type="text"
                  value={formData.footerCopyright || 'Semua hak cipta dilindungi.'}
                  onChange={(e) => setFormData({ ...formData, footerCopyright: e.target.value })}
                  placeholder="Semua hak cipta dilindungi."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 5: PRESET 1-KLIK TEMPLATE */}
          {activeTab === 'presets' && (
            <div className="space-y-4 max-w-3xl">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Pilih Paket Identitas Web Siap Pakai</span>
                </div>
                <p className="text-xs text-slate-600">
                  Klik salah satu template di bawah untuk mengisi otomatis nama web, tagline, deskripsi profesional, logo, dan jam operasional. Anda tetap bisa mengubah detailnya sesuka hati setelah menerapkan template.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    className="border border-slate-200 rounded-xl p-4 bg-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between gap-3 text-left group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          {renderLogoIcon(preset.icon)}
                          <span>{preset.name}</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {preset.settings.brandBadge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2 font-medium">
                        "{preset.settings.tagline}"
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="w-full py-2 px-3 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Terapkan Paket Ini</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {showSavedToast && (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pengaturan berhasil disimpan!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setFormData(settings)}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Form</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Identitas Web</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
