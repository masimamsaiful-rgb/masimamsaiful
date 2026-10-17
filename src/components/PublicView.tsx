import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ExternalLink, 
  AlertTriangle, 
  Wrench, 
  CheckCircle2, 
  ShieldAlert, 
  MessageCircle, 
  ShoppingBag, 
  Edit3, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  Bookmark, 
  BookmarkCheck, 
  LogIn, 
  User as UserIcon,
  Image as ImageIcon,
  Megaphone,
  Sliders,
  Clock
} from 'lucide-react';
import { GuideItem, SiteSettings } from '../data/defaultGuides';
import { AppUser, UserActivityLog } from '../data/authTypes';

interface PublicViewProps {
  guides: GuideItem[];
  categories: string[];
  settings: SiteSettings;
  onEditGuide: (guide: GuideItem) => void;
  onOpenCMS: () => void;
  currentUser: AppUser | null;
  onToggleSaveGuide: (guideId: string) => void;
  onOpenAuthModal: () => void;
  onRecordActivity: (action: UserActivityLog['action'], details: string) => void;
  onOpenSiteEditor?: () => void;
}

export const PublicView: React.FC<PublicViewProps> = ({
  guides,
  categories,
  settings,
  onEditGuide,
  onOpenCMS,
  currentUser,
  onToggleSaveGuide,
  onOpenAuthModal,
  onRecordActivity,
  onOpenSiteEditor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [openGuideId, setOpenGuideId] = useState<string | null>(guides[0]?.id || null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const filteredGuides = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return guides.filter((item) => {
      if (showSavedOnly) {
        if (!currentUser?.savedGuideIds?.includes(item.id)) return false;
      }
      const matchCategory = selectedCategory === 'Semua' || item.c === selectedCategory;
      if (!matchCategory) return false;
      if (!q) return true;
      const haystack = (
        item.t + ' ' + 
        item.g + ' ' + 
        item.p.join(' ') + ' ' + 
        item.s.join(' ') + ' ' + 
        item.a
      ).toLowerCase();
      return haystack.includes(q);
    });
  }, [guides, selectedCategory, searchQuery, showSavedOnly, currentUser]);

  // Statistics calculation
  const totalSteps = useMemo(() => {
    return guides.reduce((acc, curr) => acc + curr.s.length, 0);
  }, [guides]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: guides.length };
    categories.forEach((cat) => {
      counts[cat] = guides.filter((g) => g.c === cat).length;
    });
    return counts;
  }, [guides, categories]);

  const handleWhatsappConsult = (issueTitle?: string) => {
    if (currentUser) {
      onRecordActivity('consult_wa', `Konsultasi WA untuk: "${issueTitle || 'Umum'}"`);
    }
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      issueTitle 
        ? `${settings.whatsappMessage} "${issueTitle}". Mohon dibantu estimasi perbaikannya.` 
        : `${settings.whatsappMessage} Saya ingin konsultasi kerusakan perangkat saya.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleOpenGuide = (guide: GuideItem) => {
    const willOpen = openGuideId !== guide.id;
    setOpenGuideId(willOpen ? guide.id : null);
    if (willOpen && currentUser) {
      onRecordActivity('view_guide', `Membaca solusi: "${guide.t}"`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-16">
      
      {/* Top Announcement Bar */}
      {settings.showAnnouncement && settings.announcementText && (
        <div className={`px-4 py-2 text-xs font-medium border-b flex items-center justify-center text-center gap-2 transition-all ${
          settings.announcementColor === 'emerald'
            ? 'bg-emerald-600 text-white border-emerald-700'
            : settings.announcementColor === 'blue'
            ? 'bg-sky-600 text-white border-sky-700'
            : settings.announcementColor === 'purple'
            ? 'bg-purple-700 text-white border-purple-800'
            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-600'
        }`}>
          <Megaphone className="w-3.5 h-3.5 shrink-0" />
          <span>{settings.announcementText}</span>
          {settings.announcementLink && (
            <a
              href={settings.announcementLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold ml-1 inline-flex items-center gap-0.5 hover:opacity-90"
            >
              <span>Pelajari Lebih Lanjut</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Hero Navy Band */}
      <section className="bg-slate-900 text-slate-100 pt-8 pb-16 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-2">
                <span>{settings.tagline || 'Teknisi Hardware & Jaringan'}</span>
                <span aria-hidden="true">·</span>
                <span>Basis Data Mandiri</span>
                {onOpenSiteEditor && (
                  <button
                    onClick={onOpenSiteEditor}
                    className="inline-flex items-center gap-1 normal-case text-[11px] bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-md transition-colors cursor-pointer ml-1"
                    title="Edit nama web, tagline, dan deskripsi"
                  >
                    <Sliders className="w-3 h-3 text-amber-400" />
                    <span>Edit Info Web</span>
                  </button>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white tracking-tight leading-tight mb-3">
                Apa yang rusak di laptop atau printer Anda?
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {settings.subtitle}
              </p>
            </div>

            {/* Quick Consultation Badge */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shrink-0 max-w-xs shadow-lg">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-1">
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi Cepat Teknisi</span>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                Butuh bantuan diagnosa langsung atau panggilan servis?
              </p>
              {settings.operatingHours && (
                <div className="text-[11px] text-amber-300/90 mb-3 flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{settings.operatingHours}</span>
                </div>
              )}
              <button
                onClick={() => handleWhatsappConsult()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Tanya via WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Search Bar Input */}
          <div className="relative max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik gejala kerusakan... (contoh: kertas macet, mati total, wifi silang, laptop lemot)"
              className="w-full pl-11 pr-24 py-3.5 sm:py-4 bg-white text-slate-900 rounded-xl border border-transparent focus:outline-none focus:ring-4 focus:ring-amber-500/30 text-base shadow-lg placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 my-auto h-8 px-2.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Reset
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Stats Counter Bar (Overlapping Hero) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold font-serif text-amber-700 tabular-nums">
                {guides.length}
              </div>
              <div className="text-xs text-slate-500 font-medium">Panduan Perbaikan Aktif</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold font-serif text-slate-800 tabular-nums">
                {categories.length}
              </div>
              <div className="text-xs text-slate-500 font-medium">Kategori Masalah</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold font-serif text-slate-800 tabular-nums">
                {totalSteps}
              </div>
              <div className="text-xs text-slate-500 font-medium">Langkah Solusi Teruji</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* User login banner if not authenticated */}
        {!currentUser && (
          <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                <LogIn className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  Rekam Aktivitas & Simpan Panduan Servis Favorit Anda
                </div>
                <div className="text-[11px] text-slate-500">
                  Masuk dengan email dalam 5 detik untuk menyimpan bookmark dan histori konsultasi teknisi.
                </div>
              </div>
            </div>
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold text-xs rounded-lg transition-colors shrink-0 shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Login Email Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Category & Bookmark Filter Tabs */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
          <div className="flex items-center gap-2">
            {['Semua', ...categories].map((cat) => {
              const isSelected = !showSavedOnly && selectedCategory === cat;
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setShowSavedOnly(false);
                    setSelectedCategory(cat);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-amber-400 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bookmark filter toggle */}
          {currentUser && (
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
                showSavedOnly
                  ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Tersimpan ({currentUser.savedGuideIds?.length || 0})</span>
            </button>
          )}
        </div>

        {/* Content Layout: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Guides List (Left Column, col-span-8) */}
          <main className="lg:col-span-8 space-y-4">
            
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Menampilkan <strong>{filteredGuides.length}</strong> panduan
                {showSavedOnly ? ' (Hanya Tersimpan)' : ''}
                {searchQuery ? ` untuk pencarian "${searchQuery}"` : ''}
              </span>
              <button
                onClick={onOpenCMS}
                className="text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Masalah Baru</span>
              </button>
            </div>

            {filteredGuides.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-800 mb-1">
                  {showSavedOnly ? 'Belum ada panduan yang disimpan' : 'Belum ada panduan untuk kata kunci tersebut'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  {showSavedOnly 
                    ? 'Klik ikon bookmark pada panduan perbaikan apa saja untuk menyimpannya ke akun Anda.'
                    : 'Coba gunakan istilah gejala umum seperti "kertas macet", "mati total", "wifi", atau tambahkan artikelnya sendiri lewat panel admin!'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {showSavedOnly ? (
                    <button
                      onClick={() => setShowSavedOnly(false)}
                      className="text-xs px-3 py-1.5 bg-slate-900 text-amber-400 rounded-lg font-medium"
                    >
                      Tampilkan Semua Panduan
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
                      >
                        Bersihkan Pencarian
                      </button>
                      <button
                        onClick={onOpenCMS}
                        className="text-xs px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors font-semibold"
                      >
                        Tulis Panduan Baru di CMS
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              filteredGuides.map((guide) => {
                const isOpen = openGuideId === guide.id;
                const isSaved = currentUser?.savedGuideIds?.includes(guide.id);

                return (
                  <article
                    key={guide.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* Header Summary / Clickable */}
                    <div className="p-4 sm:p-5 flex items-start justify-between gap-4">
                      <div 
                        onClick={() => handleOpenGuide(guide)}
                        className="space-y-1.5 flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                            {guide.c}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{guide.s.length} langkah perbaikan</span>
                          {guide.updatedAt && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="hidden sm:inline">Update: {guide.updatedAt}</span>
                            </>
                          )}
                        </div>
                        <h2 className="text-base sm:text-lg font-bold font-serif text-slate-900 leading-snug hover:text-amber-700 transition-colors">
                          {guide.t}
                        </h2>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 mt-1">
                        {/* Bookmark Button */}
                        <button
                          onClick={() => {
                            if (!currentUser) {
                              onOpenAuthModal();
                            } else {
                              onToggleSaveGuide(guide.id);
                            }
                          }}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            isSaved 
                              ? 'bg-amber-50 border-amber-300 text-amber-700' 
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                          }`}
                          title={isSaved ? 'Hapus dari tersimpan' : 'Simpan panduan ini ke akun Anda'}
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleOpenGuide(guide)}
                          className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                            isOpen ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isOpen ? 'Tutup' : 'Lihat Solusi'}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Body */}
                    {isOpen && (
                      <div className="border-t border-slate-100 p-4 sm:p-5 bg-slate-50/50 space-y-5 text-sm text-slate-700">
                        
                        {/* Optional Image or Photo placeholder */}
                        {guide.imageUrl ? (
                          <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100 max-h-72">
                            <img
                              src={guide.imageUrl}
                              alt={guide.t}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-white text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                            <span>Foto/ilustrasi gejala dapat diupload langsung melalui Panel Pengelola (CMS).</span>
                          </div>
                        )}

                        {/* Symptoms */}
                        <div>
                          <h3 className="font-serif font-bold text-slate-900 text-base mb-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-4 bg-amber-500 rounded-full inline-block" />
                            Gejala Kerusakan
                          </h3>
                          <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                            {guide.g}
                          </p>
                        </div>

                        {/* Likely Causes */}
                        <div>
                          <h3 className="font-serif font-bold text-slate-900 text-base mb-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-4 bg-slate-700 rounded-full inline-block" />
                            Kemungkinan Penyebab
                          </h3>
                          <ul className="list-disc list-inside space-y-1 bg-white p-3 rounded-lg border border-slate-200/80">
                            {guide.p.map((cause, idx) => (
                              <li key={idx} className="text-slate-700">
                                {cause}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Step-by-Step Fixes */}
                        <div>
                          <h3 className="font-serif font-bold text-slate-900 text-base mb-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block" />
                            Langkah Perbaikan (SOP Teknisi)
                          </h3>
                          <div className="bg-white rounded-lg border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
                            {guide.s.map((step, idx) => (
                              <div key={idx} className="p-3 flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono">
                                  {idx + 1}
                                </span>
                                <p className="text-slate-800 leading-relaxed">
                                  {step}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Caution / When to see Technician */}
                        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 sm:p-4 text-amber-950 flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-xs uppercase tracking-wider text-amber-800 mb-0.5">
                              Kapan Perlu ke Teknisi Profesional:
                            </div>
                            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                              {guide.k}
                            </p>
                          </div>
                        </div>

                        {/* Tools & Affiliate Link */}
                        <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                              <ShoppingBag className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                              <div className="text-[11px] text-slate-500 font-medium">Alat Bantu yang Disarankan:</div>
                              <div className="text-xs sm:text-sm font-semibold text-slate-900">{guide.a}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {guide.afUrl ? (
                              <a
                                href={guide.afUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 shrink-0"
                              >
                                <span>Cek Harga / Beli</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : null}

                            <button
                              onClick={() => handleWhatsappConsult(guide.t)}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-medium text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 shrink-0"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-600" />
                              <span>Tanya Teknisi</span>
                            </button>
                          </div>
                        </div>

                        {/* Management Shortcut Bar */}
                        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-200/60">
                          <span>ID: {guide.id}</span>
                          <button
                            onClick={() => onEditGuide(guide)}
                            className="text-slate-600 hover:text-amber-700 font-medium flex items-center gap-1 transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit panduan ini di CMS</span>
                          </button>
                        </div>

                      </div>
                    )}
                  </article>
                );
              })
            )}

          </main>

          {/* Right Sidebar (col-span-4) */}
          <aside className="lg:col-span-4 space-y-5">
            
            {/* Quick Admin Callout Banner */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 border border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Pengelola Web & User</span>
              </div>
              <h3 className="font-serif font-bold text-lg mb-2 text-white">
                Direktori Pengguna & CMS
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Kelola panduan perbaikan, pantau daftar email pengguna yang login, atau unduh daftar kontak ke Excel/CSV.
              </p>
              <button
                onClick={onOpenCMS}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Buka Panel Admin CMS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Checklist Before Disassembly */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h3 className="font-serif font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                SOP Sebelum Membongkar
              </h3>
              <ul className="text-xs text-slate-600 space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Cabut adaptor charger dan lepas baterai fisik bila memungkinkan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Foto posisi awal kabel & baut sebelum dilepas agar mudah dirakit kembali.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Kelompokkan baut berdasarkan panjang dan bagian penutupnya.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Gunakan pembuka plastik (pry tool) untuk mencegah lecet pada casing.</span>
                </li>
              </ul>
            </div>

            {/* AdSense / Sponsor Slot */}
            {settings.enableAds && (
              <div className="bg-white border border-dashed border-slate-300 rounded-xl p-6 text-center shadow-xs">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Ruang Iklan / Sponsor
                </div>
                <div className="h-36 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center p-4 text-slate-500">
                  <span className="text-xs font-medium text-slate-700 mb-1">
                    Google AdSense
                  </span>
                  <span className="text-[11px] text-slate-400 max-w-[200px]">
                    {settings.adText}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  Dapat dinonaktifkan atau diganti banner di Pengaturan CMS
                </p>
              </div>
            )}

            {/* Direct Booking / Consultation Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold mb-1">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Teknisi Siap Bantu</span>
              </div>
              <h4 className="font-serif font-bold text-base text-emerald-950 mb-2">
                Tidak Sempat Bongkar Sendiri?
              </h4>
              <p className="text-xs text-emerald-900 leading-relaxed mb-4">
                Kirim foto atau video kerusakan perangkat Anda melalui WhatsApp untuk konsultasi estimasi biaya & antar-jemput servis.
              </p>
              <button
                onClick={() => handleWhatsappConsult()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Chat Teknisi di WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </aside>

        </div>

      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 pt-8 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="leading-relaxed">
          {settings.footerDisclaimer}
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCMS}
            className="text-amber-800 hover:text-amber-900 font-medium underline"
          >
            Panel Admin CMS
          </button>
          <span>·</span>
          <span>© {new Date().getFullYear()} {settings.siteName}</span>
        </div>
      </footer>

    </div>
  );
};
