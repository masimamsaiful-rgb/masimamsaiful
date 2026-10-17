import React, { useState } from 'react';
import { 
  X, 
  Menu, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Globe, 
  ExternalLink, 
  RotateCcw, 
  Sparkles, 
  Crown, 
  Trash2, 
  LayoutDashboard, 
  BookOpen, 
  MessageCircle, 
  Users, 
  Wrench, 
  Shield, 
  Zap, 
  ShoppingCart,
  Check,
  Smartphone,
  Monitor
} from 'lucide-react';
import { NavMenuItem, SiteSettings, DEFAULT_SITE_SETTINGS } from '../data/defaultGuides';
import { UserActivityLog } from '../data/authTypes';

interface MenuEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  onSaveSettings: (settings: SiteSettings) => void;
  onRecordActivity?: (action: UserActivityLog['action'], details: string) => void;
}

const AVAILABLE_ICONS = [
  { id: 'Eye', label: 'Mata / Publik', icon: Eye },
  { id: 'LayoutDashboard', label: 'Dashboard CMS', icon: LayoutDashboard },
  { id: 'BookOpen', label: 'Buku Panduan', icon: BookOpen },
  { id: 'MessageCircle', label: 'Chat WhatsApp', icon: MessageCircle },
  { id: 'Users', label: 'Direktori User', icon: Users },
  { id: 'Wrench', label: 'Servis / Teknisi', icon: Wrench },
  { id: 'Shield', label: 'Proteksi / Member', icon: Shield },
  { id: 'Zap', label: 'Kilat / Populer', icon: Zap },
  { id: 'Crown', label: 'VIP / Pro', icon: Crown },
  { id: 'Globe', label: 'Tautan Web Luar', icon: Globe },
  { id: 'ShoppingCart', label: 'Toko / Sparepart', icon: ShoppingCart },
];

const BADGE_COLORS: { id: 'amber' | 'emerald' | 'rose' | 'purple' | 'blue' | 'slate'; label: string; bg: string; text: string; border: string }[] = [
  { id: 'amber', label: 'Emas (Pro)', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40' },
  { id: 'emerald', label: 'Hijau (Hot/Free)', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40' },
  { id: 'rose', label: 'Merah (New/Sale)', bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/40' },
  { id: 'purple', label: 'Ungu (VIP)', bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/40' },
  { id: 'blue', label: 'Biru (Member)', bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/40' },
  { id: 'slate', label: 'Abu Minimalis', bg: 'bg-slate-700/60', text: 'text-slate-300', border: 'border-slate-600' },
];

export const MenuEditorModal: React.FC<MenuEditorModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onRecordActivity
}) => {
  if (!isOpen) return null;

  const [menus, setMenus] = useState<NavMenuItem[]>(() => {
    return settings.navMenus && settings.navMenus.length > 0
      ? JSON.parse(JSON.stringify(settings.navMenus))
      : JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS.navMenus));
  });

  const [accessMode, setAccessMode] = useState<'free' | 'gated'>(settings.accessMode || 'free');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [editingIconId, setEditingIconId] = useState<string | null>(null);

  // New Menu Form State
  const [newLabel, setNewLabel] = useState('');
  const [newTarget, setNewTarget] = useState<'public' | 'admin' | 'guide' | 'custom_url' | 'whatsapp' | 'users'>('custom_url');
  const [newUrl, setNewUrl] = useState('');
  const [newIcon, setNewIcon] = useState('Globe');
  const [newBadge, setNewBadge] = useState('');
  const [newBadgeColor, setNewBadgeColor] = useState<'amber' | 'emerald' | 'rose' | 'purple' | 'blue' | 'slate'>('amber');
  const [newRequiresAuth, setNewRequiresAuth] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const syncSettings = (updatedMenus: NavMenuItem[], updatedAccessMode = accessMode) => {
    setMenus(updatedMenus);
    const newSettings: SiteSettings = {
      ...settings,
      navMenus: updatedMenus,
      accessMode: updatedAccessMode,
    };
    onSaveSettings(newSettings);
  };

  // Reordering
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...menus];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    syncSettings(updated);
    showNotification('Posisi menu berhasil dipindah ke atas');
  };

  const handleMoveDown = (index: number) => {
    if (index === menus.length - 1) return;
    const updated = [...menus];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    syncSettings(updated);
    showNotification('Posisi menu berhasil dipindah ke bawah');
  };

  // Visibility toggle
  const handleToggleVisibility = (id: string) => {
    const updated = menus.map(m => m.id === id ? { ...m, visible: !m.visible } : m);
    syncSettings(updated);
  };

  // Auth requirement toggle
  const handleToggleAuth = (id: string) => {
    const updated = menus.map(m => m.id === id ? { ...m, requiresAuth: !m.requiresAuth } : m);
    syncSettings(updated);
  };

  // Update inline label
  const handleUpdateLabel = (id: string, label: string) => {
    const updated = menus.map(m => m.id === id ? { ...m, label } : m);
    syncSettings(updated);
  };

  // Update badge & color
  const handleUpdateBadge = (id: string, badge: string, badgeColor: any) => {
    const updated = menus.map(m => m.id === id ? { ...m, badge, badgeColor } : m);
    syncSettings(updated);
  };

  // Update icon
  const handleSelectIcon = (menuId: string, iconName: string) => {
    const updated = menus.map(m => m.id === menuId ? { ...m, icon: iconName } : m);
    syncSettings(updated);
    setEditingIconId(null);
    showNotification('Icon menu diperbarui');
  };

  // Delete custom menu
  const handleDeleteMenu = (id: string, label: string) => {
    const updated = menus.filter(m => m.id !== id);
    syncSettings(updated);
    showNotification(`Menu "${label}" telah dihapus`);
    if (onRecordActivity) {
      onRecordActivity('menu_change', `Menghapus menu navigasi ${label}`);
    }
  };

  // Add new menu item
  const handleAddMenu = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newLabel.trim()) return;

    let computedUrl = newUrl;
    if (newTarget === 'whatsapp') {
      const cleanPhone = settings.whatsappNumber ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '6281234567890';
      const greeting = encodeURIComponent(settings.whatsappMessage || 'Halo Meja Servis, saya mau konsultasi: ');
      computedUrl = `https://wa.me/${cleanPhone}?text=${greeting}`;
    }

    const newMenuItem: NavMenuItem = {
      id: `menu-custom-${Date.now()}`,
      label: newLabel.trim(),
      target: newTarget,
      url: computedUrl,
      visible: true,
      requiresAuth: newRequiresAuth,
      icon: newIcon,
      badge: newBadge.trim() ? newBadge.trim().toUpperCase() : undefined,
      badgeColor: newBadge.trim() ? newBadgeColor : undefined,
      openInNewTab: newTarget === 'custom_url' || newTarget === 'whatsapp',
    };

    const updated = [...menus, newMenuItem];
    syncSettings(updated);
    setNewLabel('');
    setNewUrl('');
    setNewBadge('');
    showNotification(`Menu "${newMenuItem.label}" berhasil ditambahkan!`);

    if (onRecordActivity) {
      onRecordActivity('menu_change', `Menambahkan menu baru: ${newMenuItem.label} (${newTarget})`);
    }
  };

  // Preset Template 1-Click Loaders (Gaya Web Berbayar)
  const applyPresetTemplate = (templateName: 'complete' | 'ecommerce' | 'membership' | 'default') => {
    let newItems: NavMenuItem[] = [];

    if (templateName === 'complete') {
      const cleanPhone = settings.whatsappNumber ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '6281234567890';
      newItems = [
        { id: 'menu-public', label: 'Tampilan Web', target: 'public', visible: true, icon: 'Eye' },
        { id: 'menu-admin', label: 'Panel CMS', target: 'admin', visible: true, requiresAuth: false, icon: 'LayoutDashboard', badge: 'PRO', badgeColor: 'amber' },
        { 
          id: 'menu-wa', 
          label: 'Tanya Teknisi', 
          target: 'whatsapp', 
          visible: true, 
          icon: 'MessageCircle', 
          badge: 'HOT', 
          badgeColor: 'emerald',
          url: `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Halo Meja Servis, saya mau tanya konsultasi servis: ')}`,
          openInNewTab: true 
        },
        { id: 'menu-users', label: 'Direktori User', target: 'users', visible: true, icon: 'Users', badge: 'VIP', badgeColor: 'purple' },
        { id: 'menu-guide', label: 'Panduan SOP', target: 'guide', visible: true, icon: 'BookOpen' },
      ];
      showNotification('Template Web Servis Komersil (PRO) berhasil diterapkan!');
    } else if (templateName === 'ecommerce') {
      newItems = [
        { id: 'menu-public', label: 'Katalog Servis', target: 'public', visible: true, icon: 'Eye' },
        { id: 'menu-admin', label: 'Panel CMS', target: 'admin', visible: true, icon: 'LayoutDashboard', badge: 'PRO', badgeColor: 'amber' },
        { 
          id: 'menu-sparepart', 
          label: 'Beli Sparepart', 
          target: 'custom_url', 
          visible: true, 
          icon: 'ShoppingCart', 
          badge: 'TOKO', 
          badgeColor: 'rose', 
          url: 'https://shopee.co.id',
          openInNewTab: true 
        },
        { id: 'menu-guide', label: 'Buku Manual', target: 'guide', visible: true, icon: 'BookOpen' },
      ];
      showNotification('Template Servis & Toko Online berhasil diterapkan!');
    } else if (templateName === 'membership') {
      newItems = [
        { id: 'menu-public', label: 'Panduan Gratis', target: 'public', visible: true, icon: 'Eye' },
        { id: 'menu-member', label: 'Area Member VIP', target: 'public', visible: true, requiresAuth: true, icon: 'Shield', badge: 'LOCK', badgeColor: 'blue' },
        { id: 'menu-admin', label: 'Panel Admin', target: 'admin', visible: true, icon: 'LayoutDashboard', badge: 'PRO', badgeColor: 'amber' },
      ];
      showNotification('Template Membership Gated berhasil diterapkan!');
    } else {
      newItems = JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS.navMenus));
      showNotification('Menu berhasil dikembalikan ke Standar Pabrik');
    }

    syncSettings(newItems);
    if (onRecordActivity) {
      onRecordActivity('menu_change', `Menerapkan template menu navigasi: ${templateName}`);
    }
  };

  // Toggle Access Mode
  const handleSwitchAccessMode = (mode: 'free' | 'gated') => {
    setAccessMode(mode);
    syncSettings(menus, mode);
    showNotification(`Mode akses diubah ke: ${mode === 'free' ? 'Free Bebas Masuk' : 'Wajib Login Email'}`);
  };

  const getIconComponent = (iconName?: string) => {
    const item = AVAILABLE_ICONS.find(i => i.id === iconName);
    const Comp = item ? item.icon : Eye;
    return <Comp className="w-3.5 h-3.5 shrink-0" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-inner">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white font-serif tracking-tight">
                  Editor Menu & Navigasi Dashboard
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 uppercase tracking-wider font-mono">
                  PRO BUILDER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kustomisasi tampilan menu header seperti website berbayar: atur urutan, badge PRO/HOT, hak akses, & ikon.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {successToast && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-5 py-2 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* Quick Access Policy Switcher */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Aturan Hak Akses Pengunjung:</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  accessMode === 'free' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {accessMode === 'free' ? '🟢 FREE LANGSUNG MASUK' : '🔒 WAJIB LOGIN EMAIL'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {accessMode === 'free' 
                  ? 'Pengunjung bebas membaca seluruh SOP perbaikan tanpa perlu registrasi/login email.'
                  : 'Pengunjung wajib memasukkan email terlebih dahulu untuk membaca langkah perbaikan & merekam database.'}
              </p>
            </div>

            <div className="inline-flex rounded-lg bg-slate-900 p-1 border border-slate-700 shrink-0">
              <button
                type="button"
                onClick={() => handleSwitchAccessMode('free')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  accessMode === 'free'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Free Masuk</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchAccessMode('gated')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  accessMode === 'gated'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Wajib Email</span>
              </button>
            </div>
          </div>

          {/* Live Simulator Header Preview (Like Paid Web Builders) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200">Pratinjau Langsung Navbar Header</span>
                <span className="text-[10px] text-slate-500 hidden sm:inline">(Live Visual Preview)</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1 rounded text-xs flex items-center gap-1 transition-colors ${
                    previewDevice === 'desktop' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Tampilan Desktop"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1 rounded text-xs flex items-center gap-1 transition-colors ${
                    previewDevice === 'mobile' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Tampilan Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">Mobile</span>
                </button>
              </div>
            </div>

            {/* Rendered Live Simulation Bar */}
            <div className={`mx-auto transition-all ${previewDevice === 'mobile' ? 'max-w-xs' : 'w-full'}`}>
              <div className="bg-slate-900/95 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-md">
                
                {/* Brand */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-7 h-7 rounded-md bg-amber-500 text-slate-950 font-serif font-bold text-sm flex items-center justify-center">
                    M
                  </div>
                  <div>
                    <div className="font-serif font-bold text-xs sm:text-sm text-white leading-tight">
                      {settings.siteName}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                  {menus.filter(m => m.visible).map((item) => {
                    const badgeColor = BADGE_COLORS.find(c => c.id === item.badgeColor) || BADGE_COLORS[0];
                    return (
                      <div
                        key={item.id}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
                          item.target === 'admin'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                      >
                        {getIconComponent(item.icon)}
                        <span>{item.label}</span>

                        {item.badge && (
                          <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold uppercase border ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}>
                            {item.badge}
                          </span>
                        )}

                        {item.requiresAuth && (
                          <span title="Wajib Login">
                            <Lock className="w-2.5 h-2.5 text-amber-400" />
                          </span>
                        )}

                        {item.target === 'custom_url' && (
                          <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Template Presets "Gaya Web Berbayar" */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Pilih Template Preset Menu (1-Klik Terapkan):</span>
              </span>
              <button
                type="button"
                onClick={() => applyPresetTemplate('default')}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Pabrik</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => applyPresetTemplate('complete')}
                className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-amber-300">
                    👑 Web Servis Komersil
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                    LENGKAP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Web, Panel CMS [PRO], Tanya WA [HOT], Direktori User [VIP], SOP
                </p>
              </button>

              <button
                type="button"
                onClick={() => applyPresetTemplate('ecommerce')}
                className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-rose-500/50 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-rose-300">
                    🛒 Servis & Toko Online
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">
                    TOKO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Katalog, Panel CMS [PRO], Beli Sparepart [TOKO], Buku Manual
                </p>
              </button>

              <button
                type="button"
                onClick={() => applyPresetTemplate('membership')}
                className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-blue-300">
                    🔒 Membership VIP (Gated)
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">
                    GATED
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Panduan Gratis, Area Member [LOCK], Panel Admin [PRO]
                </p>
              </button>
            </div>
          </div>

          {/* Menus Manager List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Menu className="w-4 h-4 text-amber-400" />
                <span>Susunan Menu Navigasi Aktif ({menus.length})</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal lowercase font-mono">
                ubah nama, badge, hak akses, atau posisi panah ⬆️ / ⬇️
              </span>
            </div>

            <div className="space-y-2.5">
              {menus.map((item, index) => {
                const badgeColor = BADGE_COLORS.find(c => c.id === item.badgeColor) || BADGE_COLORS[0];
                const isSystemProtected = ['menu-public', 'menu-admin'].includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      item.visible
                        ? 'bg-slate-800/90 border-slate-700 hover:border-slate-600'
                        : 'bg-slate-900/60 border-slate-800/80 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      
                      {/* Left side: Position buttons & Name & Icon */}
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        
                        {/* Up / Down Controls */}
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 rounded bg-slate-900/80 hover:bg-slate-700 text-slate-300 disabled:opacity-20 disabled:hover:bg-slate-900/80 cursor-pointer transition-colors"
                            title="Pindah ke atas"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === menus.length - 1}
                            className="p-1 rounded bg-slate-900/80 hover:bg-slate-700 text-slate-300 disabled:opacity-20 disabled:hover:bg-slate-900/80 cursor-pointer transition-colors"
                            title="Pindah ke bawah"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Order Number */}
                        <span className="text-xs font-mono text-slate-500 w-5 shrink-0">
                          #{index + 1}
                        </span>

                        {/* Icon Picker Button */}
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingIconId(editingIconId === item.id ? null : item.id)}
                            className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Klik untuk ganti icon"
                          >
                            {getIconComponent(item.icon)}
                          </button>

                          {/* Icon Dropdown */}
                          {editingIconId === item.id && (
                            <div className="absolute left-0 top-full mt-1.5 z-30 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl w-56 grid grid-cols-4 gap-1 animate-in fade-in zoom-in-95">
                              {AVAILABLE_ICONS.map((ico) => {
                                const IcoComp = ico.icon;
                                return (
                                  <button
                                    key={ico.id}
                                    type="button"
                                    onClick={() => handleSelectIcon(item.id, ico.id)}
                                    className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-slate-800 transition-colors ${
                                      item.icon === ico.id ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-300'
                                    }`}
                                    title={ico.label}
                                  >
                                    <IcoComp className="w-4 h-4" />
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Editable Label */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => handleUpdateLabel(item.id, e.target.value)}
                              className="font-bold text-white text-xs sm:text-sm bg-slate-900/90 border border-slate-700 focus:border-amber-400 rounded-lg px-2.5 py-1 focus:outline-none transition-colors w-full sm:w-auto min-w-[140px]"
                              placeholder="Nama menu..."
                            />

                            {/* Target Tag */}
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700 font-mono">
                              {item.target === 'custom_url' ? 'Link URL' : item.target === 'whatsapp' ? 'WhatsApp' : 'Internal'}
                            </span>
                          </div>

                          {item.url && (
                            <div className="text-[11px] text-sky-400 truncate max-w-sm mt-0.5">
                              {item.url}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right side: Badge customizer, Auth Gating, Show/Hide, Delete */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                        
                        {/* Custom Badge Tag input */}
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5">
                          <span className="text-[10px] text-slate-500 font-mono">TAG:</span>
                          <input
                            type="text"
                            value={item.badge || ''}
                            onChange={(e) => handleUpdateBadge(item.id, e.target.value.toUpperCase(), item.badgeColor || 'amber')}
                            placeholder="PRO / HOT"
                            maxLength={8}
                            className="w-16 text-[10px] uppercase font-mono font-bold bg-transparent text-amber-300 focus:outline-none"
                            title="Tulis teks badge seperti PRO, HOT, NEW, VIP"
                          />
                          {item.badge && (
                            <select
                              value={item.badgeColor || 'amber'}
                              onChange={(e) => handleUpdateBadge(item.id, item.badge || '', e.target.value as any)}
                              className="text-[9px] bg-slate-800 text-slate-300 rounded border border-slate-700 py-0.5 px-1 focus:outline-none cursor-pointer"
                              title="Pilih warna badge"
                            >
                              <option value="amber">Emas</option>
                              <option value="emerald">Hijau</option>
                              <option value="rose">Merah</option>
                              <option value="purple">Ungu</option>
                              <option value="blue">Biru</option>
                            </select>
                          )}
                        </div>

                        {/* Auth Gate Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleAuth(item.id)}
                          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors flex items-center gap-1 border cursor-pointer ${
                            item.requiresAuth
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                          }`}
                          title={item.requiresAuth ? 'Status: Hanya untuk user login. Klik untuk bebaskan' : 'Status: Bebas semua pengunjung. Klik untuk wajibkan login'}
                        >
                          {item.requiresAuth ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3 text-slate-400" />}
                          <span className="text-[10px] font-mono">{item.requiresAuth ? 'Member Only' : 'Bebas'}</span>
                        </button>

                        {/* Visibility Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(item.id)}
                          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5 border cursor-pointer ${
                            item.visible
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}
                          title={item.visible ? 'Klik untuk sembunyikan menu' : 'Klik untuk tampilkan menu'}
                        >
                          {item.visible ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                          <span className="text-[10px] font-mono">{item.visible ? 'Tampil' : 'Hide'}</span>
                        </button>

                        {/* Delete button (unless core protected) */}
                        {!isSystemProtected && (
                          <button
                            type="button"
                            onClick={() => handleDeleteMenu(item.id, item.label)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Hapus menu custom ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add New Custom Menu Form */}
          <form onSubmit={handleAddMenu} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Tambah Menu Navigasi Baru</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Pilih target aksi atau tautan eksternal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Nama Menu *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Konsultasi Teknisi..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-lg text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Target Halaman / Aksi
                </label>
                <select
                  value={newTarget}
                  onChange={(e) => {
                    const target = e.target.value as any;
                    setNewTarget(target);
                    if (target === 'whatsapp') {
                      setNewIcon('MessageCircle');
                      setNewBadge('HOT');
                    } else if (target === 'users') {
                      setNewIcon('Users');
                      setNewBadge('VIP');
                    } else if (target === 'custom_url') {
                      setNewIcon('Globe');
                    }
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-lg text-white focus:outline-none cursor-pointer"
                >
                  <option value="custom_url">🌐 Tautan Luar (URL Website Lain)</option>
                  <option value="whatsapp">💬 Chat WhatsApp Konsultasi Cepat</option>
                  <option value="public">🏢 Halaman Publik (Tampilan Web)</option>
                  <option value="admin">⚡ Panel Pengelola (CMS)</option>
                  <option value="users">👥 Direktori & Rekam Pengguna</option>
                  <option value="guide">📖 Buku Panduan SOP</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Badge Label (Opsional)
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="PRO, HOT, NEW..."
                    maxLength={8}
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value.toUpperCase())}
                    className="w-full px-2.5 py-1.5 text-xs font-mono font-bold bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-lg text-amber-300 focus:outline-none"
                  />
                  <select
                    value={newBadgeColor}
                    onChange={(e) => setNewBadgeColor(e.target.value as any)}
                    className="text-xs bg-slate-900 text-slate-300 border border-slate-700 rounded-lg px-2 focus:outline-none cursor-pointer"
                  >
                    <option value="amber">Emas</option>
                    <option value="emerald">Hijau</option>
                    <option value="rose">Merah</option>
                    <option value="purple">Ungu</option>
                    <option value="blue">Biru</option>
                  </select>
                </div>
              </div>

              {newTarget === 'custom_url' && (
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    URL Tautan Lengkap (https://...) *
                  </label>
                  <input
                    type="url"
                    placeholder="https://toko-sparepart.com atau https://instagram.com/..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-lg text-white focus:outline-none"
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={newRequiresAuth}
                  onChange={(e) => setNewRequiresAuth(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-400"
                />
                <span>Hanya tampil / dapat dibuka member yang sudah login email</span>
              </label>

              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambahkan Menu Ini</span>
              </button>
            </div>
          </form>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Perubahan tersimpan otomatis & langsung aktif di web</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer border border-slate-700"
          >
            Selesai & Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
