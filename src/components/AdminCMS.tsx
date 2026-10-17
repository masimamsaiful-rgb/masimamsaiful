import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  X, 
  Save, 
  Search, 
  Filter, 
  ExternalLink, 
  Sparkles, 
  ShoppingBag, 
  Phone, 
  DollarSign, 
  AlertCircle,
  FileText,
  Tag,
  Wrench,
  Users,
  UserCheck,
  Shield,
  Clock,
  FileSpreadsheet,
  UserPlus,
  Mail,
  Activity,
  Image as ImageIcon,
  Lock,
  Unlock,
  Menu,
  Eye,
  EyeOff,
  Globe,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Crown,
  MessageCircle,
  LayoutDashboard,
  BookOpen,
  Sliders,
  Megaphone,
  Cpu,
  Laptop,
  Zap,
  Flame,
  Smartphone,
  Server
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { GuideItem, SiteSettings, NavMenuItem, TEMPLATES_QUICK_ADD } from '../data/defaultGuides';
import { AppUser, UserActivityLog, UserRole } from '../data/authTypes';
import { BulkExcelImportModal } from './BulkExcelImportModal';

interface AdminCMSProps {
  guides: GuideItem[];
  categories: string[];
  settings: SiteSettings;
  onSaveGuides: (guides: GuideItem[]) => void;
  onSaveCategories: (categories: string[]) => void;
  onSaveSettings: (settings: SiteSettings) => void;
  onResetDefault: () => void;
  initialEditingGuide?: GuideItem | null;
  onClearInitialEdit?: () => void;
  onSwitchToPublic: () => void;
  allUsers: AppUser[];
  onSaveUsers: (users: AppUser[]) => void;
  activityLogs: UserActivityLog[];
  onAddLog: (action: UserActivityLog['action'], details: string, user: AppUser) => void;
  currentUser: AppUser | null;
  initialActiveTab?: 'guides' | 'users' | 'menus' | 'categories' | 'settings' | 'backup';
  onOpenSiteEditor?: () => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  guides,
  categories,
  settings,
  onSaveGuides,
  onSaveCategories,
  onSaveSettings,
  onResetDefault,
  initialEditingGuide,
  onClearInitialEdit,
  onSwitchToPublic,
  allUsers,
  onSaveUsers,
  activityLogs,
  onAddLog,
  currentUser,
  initialActiveTab,
  onOpenSiteEditor,
}) => {
  const [activeTab, setActiveTab] = useState<'guides' | 'users' | 'menus' | 'categories' | 'settings' | 'backup'>(initialActiveTab || 'guides');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab);
    }
  }, [initialActiveTab]);

  useEffect(() => {
    if (settings.navMenus) {
      setMenusList(settings.navMenus);
    }
  }, [settings.navMenus]);

  // Menu editor states
  const [menusList, setMenusList] = useState<NavMenuItem[]>(settings.navMenus || [
    { id: 'menu-public', label: 'Tampilan Web', target: 'public', visible: true },
    { id: 'menu-admin', label: 'Panel CMS', target: 'admin', visible: true },
    { id: 'menu-guide', label: 'Panduan Pengelolaan', target: 'guide', visible: true },
  ]);
  const [newMenuLabel, setNewMenuLabel] = useState('');
  const [newMenuTarget, setNewMenuTarget] = useState<'public' | 'admin' | 'guide' | 'custom_url' | 'whatsapp' | 'users'>('custom_url');
  const [newMenuUrl, setNewMenuUrl] = useState('');
  const [newMenuBadge, setNewMenuBadge] = useState('');
  const [newMenuBadgeColor, setNewMenuBadgeColor] = useState<'amber' | 'emerald' | 'rose' | 'purple' | 'blue' | 'slate'>('amber');

  // User management tab states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | UserRole>('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isBulkExcelModalOpen, setIsBulkExcelModalOpen] = useState(false);
  
  // New manual user form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('member');
  const [newUserInterest, setNewUserInterest] = useState('Semua Perangkat');

  // Modal / Form state for Add or Edit Guide
  const [isModalOpen, setIsModalOpen] = useState(!!initialEditingGuide);
  const [editingId, setEditingId] = useState<string | null>(initialEditingGuide ? initialEditingGuide.id : null);
  
  // Form fields
  const [formCategory, setFormCategory] = useState(initialEditingGuide ? initialEditingGuide.c : (categories[0] || 'Laptop'));
  const [formTitle, setFormTitle] = useState(initialEditingGuide ? initialEditingGuide.t : '');
  const [formGejala, setFormGejala] = useState(initialEditingGuide ? initialEditingGuide.g : '');
  const [formPenyebab, setFormPenyebab] = useState<string[]>(initialEditingGuide ? [...initialEditingGuide.p] : ['']);
  const [formLangkah, setFormLangkah] = useState<string[]>(initialEditingGuide ? [...initialEditingGuide.s] : ['']);
  const [formTeknisi, setFormTeknisi] = useState(initialEditingGuide ? initialEditingGuide.k : '');
  const [formAlat, setFormAlat] = useState(initialEditingGuide ? initialEditingGuide.a : '');
  const [formAfUrl, setFormAfUrl] = useState(initialEditingGuide?.afUrl || '');
  const [formImageUrl, setFormImageUrl] = useState(initialEditingGuide?.imageUrl || '');
  
  // Quick status notice
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Settings form states
  const [tempSettings, setTempSettings] = useState<SiteSettings>({ ...settings });
  
  // Category management states
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Handle open modal for create
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormCategory(categories[0] || 'Laptop');
    setFormTitle('');
    setFormGejala('');
    setFormPenyebab(['']);
    setFormLangkah(['', '']);
    setFormTeknisi('Jika sudah mencoba langkah di atas namun tidak berhasil, bawa ke teknisi profesional.');
    setFormAlat('Set obeng presisi & alat tes');
    setFormAfUrl('https://shopee.co.id');
    setFormImageUrl('');
    setIsModalOpen(true);
  };

  // Handle open modal for edit
  const handleOpenEditModal = (guide: GuideItem) => {
    setEditingId(guide.id);
    setFormCategory(guide.c);
    setFormTitle(guide.t);
    setFormGejala(guide.g);
    setFormPenyebab([...guide.p]);
    setFormLangkah([...guide.s]);
    setFormTeknisi(guide.k);
    setFormAlat(guide.a);
    setFormAfUrl(guide.afUrl || '');
    setFormImageUrl(guide.imageUrl || '');
    setIsModalOpen(true);
  };

  // Duplicate a guide
  const handleDuplicateGuide = (guide: GuideItem) => {
    const duplicated: GuideItem = {
      ...guide,
      id: `g-${Date.now()}`,
      t: `${guide.t} (Salinan)`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    onSaveGuides([duplicated, ...guides]);
    showToast(`Panduan "${duplicated.t}" berhasil diduplikasi.`);
  };

  // Delete a guide
  const handleDeleteGuide = (id: string, title: string) => {
    if (window.confirm(`Yakin ingin menghapus panduan "${title}"?`)) {
      onSaveGuides(guides.filter((g) => g.id !== id));
      showToast(`Panduan "${title}" berhasil dihapus.`);
    }
  };

  // Apply quick template
  const handleApplyTemplate = (tmpl: typeof TEMPLATES_QUICK_ADD[0]) => {
    setFormCategory(tmpl.c);
    setFormTitle(tmpl.t);
    setFormGejala(tmpl.g);
    setFormPenyebab([...tmpl.p]);
    setFormLangkah([...tmpl.s]);
    setFormTeknisi(tmpl.k);
    setFormAlat(tmpl.a);
    setFormAfUrl('https://shopee.co.id/search?keyword=' + encodeURIComponent(tmpl.a));
    showToast(`Template "${tmpl.t}" berhasil dimuat ke formulir.`);
  };

  // Image file upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB untuk performa optimal');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormImageUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Guide (Add or Update)
  const handleSubmitGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Judul masalah wajib diisi');
      return;
    }

    const cleanPenyebab = formPenyebab.map(p => p.trim()).filter(Boolean);
    const cleanLangkah = formLangkah.map(s => s.trim()).filter(Boolean);

    const guidePayload: GuideItem = {
      id: editingId || `g-${Date.now()}`,
      c: formCategory,
      t: formTitle.trim(),
      g: formGejala.trim() || 'Gejala belum dijelaskan rinci.',
      p: cleanPenyebab.length ? cleanPenyebab : ['Penyebab hardware atau sistem'],
      s: cleanLangkah.length ? cleanLangkah : ['Periksa koneksi fisik dan restart perangkat'],
      k: formTeknisi.trim() || 'Bawa ke teknisi jika langkah awal gagal.',
      a: formAlat.trim() || 'Obeng presisi dan alat diagnosa',
      afUrl: formAfUrl.trim() || undefined,
      imageUrl: formImageUrl.trim() || undefined,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (editingId) {
      onSaveGuides(guides.map((g) => (g.id === editingId ? guidePayload : g)));
      showToast('Perubahan panduan berhasil disimpan!');
    } else {
      onSaveGuides([guidePayload, ...guides]);
      showToast('Panduan perbaikan baru berhasil ditambahkan!');
    }

    setIsModalOpen(false);
    if (onClearInitialEdit) onClearInitialEdit();
  };

  // Category additions
  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      alert('Kategori sudah ada!');
      return;
    }
    onSaveCategories([...categories, trimmed]);
    setNewCategoryInput('');
    showToast(`Kategori "${trimmed}" berhasil ditambahkan.`);
  };

  const handleDeleteCategory = (catName: string) => {
    if (categories.length <= 1) {
      alert('Minimal harus ada 1 kategori!');
      return;
    }
    const count = guides.filter(g => g.c === catName).length;
    if (count > 0) {
      const confirmMove = window.confirm(
        `Kategori "${catName}" masih digunakan oleh ${count} panduan. Panduan tersebut akan dipindahkan ke kategori "${categories[0]}". Lanjutkan?`
      );
      if (!confirmMove) return;
      onSaveGuides(guides.map(g => g.c === catName ? { ...g, c: categories[0] } : g));
    }
    onSaveCategories(categories.filter(c => c !== catName));
    showToast(`Kategori "${catName}" berhasil dihapus.`);
  };

  // Menu Management Handlers
  const handleSaveMenus = (updated: NavMenuItem[]) => {
    setMenusList(updated);
    const updatedSettings: SiteSettings = {
      ...tempSettings,
      navMenus: updated,
    };
    onSaveSettings(updatedSettings);
    setTempSettings(updatedSettings);
    showToast('Struktur menu navigasi berhasil diperbarui!');
  };

  const handleToggleMenuVisibility = (menuId: string) => {
    const updated = menusList.map(m => m.id === menuId ? { ...m, visible: !m.visible } : m);
    handleSaveMenus(updated);
  };

  const handleToggleMenuAuth = (menuId: string) => {
    const updated = menusList.map(m => m.id === menuId ? { ...m, requiresAuth: !m.requiresAuth } : m);
    handleSaveMenus(updated);
    const target = updated.find(m => m.id === menuId);
    showToast(`Menu "${target?.label}": ${target?.requiresAuth ? 'Wajib Login Email' : 'Bebas Masuk / Publik'}`);
  };

  const handleUpdateMenuLabel = (menuId: string, newLabel: string) => {
    const updated = menusList.map(m => m.id === menuId ? { ...m, label: newLabel } : m);
    handleSaveMenus(updated);
  };

  const handleUpdateMenuBadge = (menuId: string, badge: string, badgeColor: any) => {
    const updated = menusList.map(m => m.id === menuId ? { ...m, badge, badgeColor } : m);
    handleSaveMenus(updated);
  };

  const handleMoveMenuUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...menusList];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    handleSaveMenus(updated);
  };

  const handleMoveMenuDown = (index: number) => {
    if (index >= menusList.length - 1) return;
    const updated = [...menusList];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    handleSaveMenus(updated);
  };

  const handleApplyMenuTemplate = (type: 'complete' | 'ecommerce' | 'membership' | 'default') => {
    let newItems: NavMenuItem[] = [];

    if (type === 'complete') {
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
          url: `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Halo Meja Servis, saya mau konsultasi: ')}`,
          openInNewTab: true 
        },
        { id: 'menu-users', label: 'Direktori User', target: 'users', visible: true, icon: 'Users', badge: 'VIP', badgeColor: 'purple' },
        { id: 'menu-guide', label: 'Panduan SOP', target: 'guide', visible: true, icon: 'BookOpen' },
      ];
      showToast('Template Web Servis Komersil (PRO) berhasil diterapkan!');
    } else if (type === 'ecommerce') {
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
      showToast('Template Servis & Toko Online berhasil diterapkan!');
    } else if (type === 'membership') {
      newItems = [
        { id: 'menu-public', label: 'Panduan Gratis', target: 'public', visible: true, icon: 'Eye' },
        { id: 'menu-member', label: 'Area Member VIP', target: 'public', visible: true, requiresAuth: true, icon: 'Shield', badge: 'LOCK', badgeColor: 'blue' },
        { id: 'menu-admin', label: 'Panel Admin', target: 'admin', visible: true, icon: 'LayoutDashboard', badge: 'PRO', badgeColor: 'amber' },
      ];
      showToast('Template Membership Gated berhasil diterapkan!');
    } else {
      newItems = [
        { id: 'menu-public', label: 'Tampilan Web', target: 'public', visible: true, icon: 'Eye' },
        { id: 'menu-admin', label: 'Panel CMS', target: 'admin', visible: true, requiresAuth: false, icon: 'LayoutDashboard', badge: 'PRO', badgeColor: 'amber' },
        { id: 'menu-guide', label: 'Panduan Pengelolaan', target: 'guide', visible: true, icon: 'BookOpen' },
      ];
      showToast('Menu navigasi berhasil dikembalikan ke Standar Pabrik.');
    }

    handleSaveMenus(newItems);
  };

  const handleAddCustomMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuLabel.trim()) {
      showToast('Label menu wajib diisi');
      return;
    }

    let computedUrl = newMenuUrl.trim();
    if (newMenuTarget === 'whatsapp') {
      const cleanPhone = settings.whatsappNumber ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '6281234567890';
      computedUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Halo Meja Servis, saya mau konsultasi: ')}`;
    }

    const newMenu: NavMenuItem = {
      id: `menu-custom-${Date.now()}`,
      label: newMenuLabel.trim(),
      target: newMenuTarget,
      url: computedUrl || undefined,
      visible: true,
      requiresAuth: false,
      badge: newMenuBadge.trim() ? newMenuBadge.trim().toUpperCase() : undefined,
      badgeColor: newMenuBadge.trim() ? newMenuBadgeColor : undefined,
      openInNewTab: newMenuTarget === 'custom_url' || newMenuTarget === 'whatsapp',
    };
    const updated = [...menusList, newMenu];
    handleSaveMenus(updated);
    setNewMenuLabel('');
    setNewMenuUrl('');
    setNewMenuBadge('');
    showToast(`Menu "${newMenu.label}" berhasil ditambahkan!`);
  };

  const handleDeleteMenu = (menuId: string, label: string) => {
    if (['menu-public', 'menu-admin', 'menu-guide'].includes(menuId)) {
      showToast('Menu bawaan tidak dapat dihapus, tapi bisa disembunyikan.');
      return;
    }
    const updated = menusList.filter(m => m.id !== menuId);
    handleSaveMenus(updated);
    showToast(`Menu "${label}" berhasil dihapus.`);
  };

  const handleResetMenusDefault = () => {
    handleApplyMenuTemplate('default');
  };

  // Quick Access Mode Toggle (Free vs Gated)
  const handleToggleAccessMode = (mode: 'free' | 'gated') => {
    const updatedSettings: SiteSettings = {
      ...tempSettings,
      accessMode: mode,
    };
    setTempSettings(updatedSettings);
    onSaveSettings(updatedSettings);
    if (currentUser) {
      onAddLog('edit_guide', `Mengubah kebijakan akses situs menjadi: ${mode === 'free' ? 'Bebas Masuk (Free)' : 'Wajib Login Email (Gated)'}`, currentUser);
    }
    showToast(
      mode === 'free'
        ? 'Mode Akses: Free (Bebas Masuk Langsung) aktif!'
        : 'Mode Akses: Perlu Login Email aktif! Pengunjung wajib memasukkan email untuk membaca solusi.'
    );
  };

  const handleToggleCMSProtection = (requireLogin: boolean) => {
    const updatedSettings: SiteSettings = {
      ...tempSettings,
      requireLoginForCMS: requireLogin,
    };
    setTempSettings(updatedSettings);
    onSaveSettings(updatedSettings);
    if (currentUser) {
      onAddLog('edit_guide', `Mengubah proteksi panel CMS menjadi: ${requireLogin ? 'Khusus Teknisi/Admin' : 'Terbuka Umum'}`, currentUser);
    }
    showToast(
      requireLogin
        ? 'Panel CMS sekarang hanya bisa diakses user login Teknisi/Admin.'
        : 'Panel CMS sekarang terbuka bebas untuk umum.'
    );
  };

  // User Management Handlers
  const handleAddUserManual = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newUserEmail.trim().toLowerCase();
    const cleanName = newUserName.trim();

    if (!cleanEmail || !cleanName) {
      alert('Nama dan email wajib diisi');
      return;
    }

    if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      alert('Email sudah terdaftar!');
      return;
    }

    const now = new Date().toLocaleString('id-ID', { hour12: false });
    const newUser: AppUser = {
      id: `u-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: newUserPhone.trim() || undefined,
      role: newUserRole,
      deviceInterest: newUserInterest,
      createdAt: now,
      lastLoginAt: 'Belum pernah login',
      savedGuideIds: [],
      status: 'active'
    };

    onSaveUsers([newUser, ...allUsers]);
    if (currentUser) {
      onAddLog('create_guide', `Admin menambahkan pengguna baru manual: ${cleanName} (${cleanEmail})`, currentUser);
    }
    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    showToast(`Pengguna "${cleanName}" berhasil didaftarkan ke sistem!`);
  };

  const handleChangeUserRole = (userId: string, newRole: UserRole) => {
    const updated = allUsers.map(u => u.id === userId ? { ...u, role: newRole } : u);
    onSaveUsers(updated);
    showToast('Hak akses / Role pengguna berhasil diperbarui.');
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (allUsers.length <= 1) {
      alert('Tidak bisa menghapus semua pengguna!');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus data pengguna "${userName}"?`)) {
      onSaveUsers(allUsers.filter(u => u.id !== userId));
      showToast(`Pengguna "${userName}" berhasil dihapus.`);
    }
  };

  // Export Users to CSV
  const handleExportUsersCSV = () => {
    const headers = ['ID', 'Nama', 'Email', 'Nomor_WA', 'Peran_Role', 'Minat_Perangkat', 'Tanggal_Daftar', 'Terakhir_Login', 'Status'];
    const rows = allUsers.map(u => [
      `"${u.id}"`,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email}"`,
      `"${u.phone || '-'}"`,
      `"${u.role}"`,
      `"${u.deviceInterest || '-'}"`,
      `"${u.createdAt}"`,
      `"${u.lastLoginAt}"`,
      `"${u.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meja-servis-data-pengguna-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Data semua pengguna berhasil diekspor ke file CSV!');
  };

  // Bulk Excel Import Callback
  const handleBulkExcelImportSuccess = (importedGuides: GuideItem[], mode: 'append' | 'replace', newCategories: string[]) => {
    if (mode === 'replace') {
      onSaveGuides(importedGuides);
    } else {
      onSaveGuides([...importedGuides, ...guides]);
    }
    if (newCategories.length > 0) {
      onSaveCategories([...categories, ...newCategories]);
    }
    if (currentUser) {
      onAddLog('create_guide', `Impor kolektif ${importedGuides.length} panduan dari file spreadsheet Excel (.xls/.xlsx)`, currentUser);
    }
    showToast(`Berhasil mengimpor kolektif ${importedGuides.length} panduan dari file Excel!`);
  };

  // Export all Guides to Excel (.xlsx)
  const handleExportGuidesToExcel = () => {
    const rows = guides.map((g) => ({
      'Kategori': g.c,
      'Judul_Masalah': g.t,
      'Gejala': g.g,
      'Kemungkinan_Penyebab': g.p.join('; '),
      'Langkah_Perbaikan': g.s.join('; '),
      'Kapan_Ke_Teknisi': g.k,
      'Alat_Rekomendasi': g.a,
      'Link_Afiliasi': g.afUrl || ''
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
      { wch: 15 },
      { wch: 35 },
      { wch: 45 },
      { wch: 45 },
      { wch: 55 },
      { wch: 40 },
      { wch: 30 },
      { wch: 30 }
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Panduan');
    XLSX.writeFile(wb, `Meja_Servis_Koleksi_Panduan_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('Seluruh panduan berhasil diekspor ke file Excel (.xlsx)!');
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(tempSettings);
    showToast('Pengaturan situs berhasil diperbarui!');
  };

  // Backup & JSON Export
  const handleExportJSON = () => {
    const data = {
      version: '1.1',
      exportedAt: new Date().toISOString(),
      settings,
      categories,
      guides,
      users: allUsers,
      logs: activityLogs
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meja-servis-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('File backup JSON lengkap berhasil diunduh!');
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(guides, null, 2));
    showToast('Data JSON panduan disalin ke clipboard! Siap ditempel ke file kode.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onSaveGuides(parsed);
          showToast(`Berhasil mengimpor ${parsed.length} panduan!`);
        } else if (parsed.guides && Array.isArray(parsed.guides)) {
          onSaveGuides(parsed.guides);
          if (parsed.categories && Array.isArray(parsed.categories)) {
            onSaveCategories(parsed.categories);
          }
          if (parsed.settings) {
            onSaveSettings(parsed.settings);
            setTempSettings(parsed.settings);
          }
          if (parsed.users && Array.isArray(parsed.users)) {
            onSaveUsers(parsed.users);
          }
          showToast(`Berhasil memulihkan panduan, data pengguna, dan pengaturan!`);
        } else {
          alert('Format JSON tidak sesuai!');
        }
      } catch (err) {
        alert('Gagal membaca file JSON. Pastikan format valid.');
      }
    };
    reader.readAsText(file);
  };

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  // Filtered guides list for CMS table
  const cmsFilteredGuides = guides.filter((g) => {
    const matchCat = categoryFilter === 'Semua' || g.c === categoryFilter;
    if (!matchCat) return false;
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return g.t.toLowerCase().includes(q) || g.g.toLowerCase().includes(q);
  });

  // Filtered users list
  const filteredUsers = allUsers.filter((u) => {
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    if (!matchRole) return false;
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone && u.phone.includes(q));
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs sm:text-sm animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
            <span>Panel Pengelola Konten & User (CMS)</span>
            <span aria-hidden="true">·</span>
            <span>Meja Servis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Kelola Website & Direktori Pengguna
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rekam semua user login, kelola panduan perbaikan, atur nomor WhatsApp konsultasi, serta ekspor data ke Excel/CSV.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onSwitchToPublic}
            className="px-3.5 py-2 text-xs sm:text-sm font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span>Pratinjau Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsBulkExcelModalOpen(true)}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            title="Input panduan kolektif dari spreadsheet Excel (.xls / .xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Input Kolektif .XLS</span>
          </button>
          
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Panduan Baru</span>
          </button>
        </div>
      </div>

      {/* Quick Tool: Akses Masuk Pengunjung (Free vs Gated) & Navigasi Shortcut */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Tool Kontrol Akses Masuk Pengunjung</span>
              </span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                tempSettings.accessMode === 'gated'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {tempSettings.accessMode === 'gated' ? '🔒 Perlu Login Email (Gated)' : '🟢 Free Langsung Masuk'}
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-xl">
              {tempSettings.accessMode === 'free'
                ? 'Pengunjung bebas langsung membaca seluruh panduan, gejala, penyebab, dan SOP perbaikan tanpa wajib login email.'
                : 'Pengunjung wajib memasukkan email terlebih dahulu untuk membaca SOP langkah perbaikan & otomatis merekam data user.'}
            </p>
          </div>

          {/* Quick Segmented Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => handleToggleAccessMode('free')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  tempSettings.accessMode === 'free'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Free (Bebas Masuk)</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleAccessMode('gated')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  tempSettings.accessMode === 'gated'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Perlu Login Email</span>
              </button>
            </div>

            {/* Quick Link to Site Identity Editor */}
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span>Edit Nama & Info Web</span>
              <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1 rounded font-mono">
                PRO
              </span>
            </button>

            {/* Quick Link to Menu Editor */}
            <button
              type="button"
              onClick={() => setActiveTab('menus')}
              className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'menus'
                  ? 'bg-blue-50 text-blue-800 border-blue-200 font-semibold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Menu className="w-3.5 h-3.5 text-blue-600" />
              <span>Edit Menu Navigasi</span>
            </button>
          </div>
        </div>

        {/* Protection sub-options */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={tempSettings.requireLoginForCMS}
              onChange={(e) => handleToggleCMSProtection(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span className="font-medium text-slate-700">
              Kunci Panel CMS hanya untuk akun Teknisi / Admin (Mencegah publik mengedit)
            </span>
          </label>

          <span className="text-[11px] text-slate-400">
            Perubahan mode akses langsung aktif di tampilan web secara instan.
          </span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('guides')}
          className={`pb-3 px-3 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'guides'
              ? 'border-amber-600 text-amber-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Daftar Panduan</span>
          <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono">
            {guides.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-3 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'users'
              ? 'border-amber-600 text-amber-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Rekam Pengguna (User Directory)</span>
          <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono">
            {allUsers.length} User
          </span>
        </button>

        <button
          onClick={() => setActiveTab('menus')}
          className={`pb-3 px-3 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'menus'
              ? 'border-amber-600 text-amber-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Menu className="w-4 h-4 text-blue-600" />
          <span>Kelola Menu</span>
          <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-800 font-mono">
            {menusList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-3 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'categories'
              ? 'border-amber-600 text-amber-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Kelola Kategori</span>
          <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono">
            {categories.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-3 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'settings'
              ? 'border-amber-600 text-amber-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-600" />
          <span>Identitas & Info Web</span>
          <span className="text-[10px] bg-amber-500/20 text-amber-800 border border-amber-300 font-bold px-1.5 py-0.2 rounded font-mono">
            PRO
          </span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`pb-3 px-3 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'backup'
              ? 'border-amber-600 text-amber-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Backup & Ekspor Data</span>
        </button>
      </div>

      {/* Tab: REKAM PENGGUNA (USERS & ACTIVITY LOGS) */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          
          {/* Metrics summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Total Akun Terdaftar</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold font-serif text-slate-900 mt-1 tabular-nums">
                {allUsers.length}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Admin & Teknisi</span>
                <Shield className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold font-serif text-slate-900 mt-1 tabular-nums">
                {allUsers.filter(u => u.role === 'admin' || u.role === 'technician').length}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Member Komunitas</span>
                <UserCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold font-serif text-slate-900 mt-1 tabular-nums">
                {allUsers.filter(u => u.role === 'member').length}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Log Interaksi Terekam</span>
                <Activity className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold font-serif text-slate-900 mt-1 tabular-nums">
                {activityLogs.length}
              </div>
            </div>
          </div>

          {/* Controls: Search, Filter, Export CSV, and Add User */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari user berdasarkan nama, email, atau no. WA..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value as any)}
                className="py-1.5 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="all">Semua Peran</option>
                <option value="admin">Admin</option>
                <option value="technician">Teknisi</option>
                <option value="member">Member</option>
              </select>

              <button
                onClick={handleExportUsersCSV}
                className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
                title="Unduh seluruh data pengguna ke format Excel / CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Ekspor Excel / CSV</span>
                <span className="sm:hidden">CSV</span>
              </button>

              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1 shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tambah User</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Nama & Email</th>
                    <th className="py-3 px-4">Kontak WhatsApp</th>
                    <th className="py-3 px-4">Hak Akses / Role</th>
                    <th className="py-3 px-4">Minat Perangkat</th>
                    <th className="py-3 px-4">Terakhir Aktif</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Tidak ada pengguna yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 truncate">
                                {user.name}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400 inline" />
                                <span>{user.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {user.phone ? (
                            <a
                              href={`https://wa.me/${user.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:underline flex items-center gap-1 font-mono text-[11px]"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{user.phone}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleChangeUserRole(user.id, e.target.value as UserRole)}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              user.role === 'admin'
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : user.role === 'technician'
                                ? 'bg-purple-50 text-purple-900 border-purple-300'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="admin">Admin</option>
                            <option value="technician">Teknisi</option>
                            <option value="member">Member</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          {user.deviceInterest || 'Semua'}
                        </td>

                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{user.lastLoginAt}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Daftar: {user.createdAt.split(' ')[0]}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            disabled={user.email === 'masimamsaiful@gmail.com'}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                            title={user.email === 'masimamsaiful@gmail.com' ? 'Super admin tidak dapat dihapus' : 'Hapus data user'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Logs Trail */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <Activity className="w-4 h-4 text-amber-600" />
                <span>Log Aktivitas & Audit Trail Pengguna</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Merekam aksi login, konsultasi, dan interaksi secara otomatis
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {activityLogs.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  Belum ada log aktivitas terekam.
                </div>
              ) : (
                activityLogs.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.action === 'login' ? 'bg-emerald-100 text-emerald-800' :
                        log.action === 'register' ? 'bg-blue-100 text-blue-800' :
                        log.action === 'consult_wa' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.action.replace('_', ' ')}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">{log.userName}</span>
                      <span className="text-slate-500 truncate">- {log.details}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                      {log.timestamp}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Tab: MENU BUILDER / KELOLA MENU DASHBOARD */}
      {activeTab === 'menus' && (
        <div className="max-w-4xl bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
                  <Menu className="w-5 h-5 text-blue-600" />
                  <span>Tool Edit Menu & Navigasi Dashboard</span>
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 uppercase tracking-wider font-mono">
                  PRO BUILDER
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Kustomisasi tampilan menu header seperti web berbayar: atur urutan posisi, badge PRO/HOT/NEW, hak akses, atau tautan WhatsApp/Toko.
              </p>
            </div>
            <button
              onClick={handleResetMenusDefault}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>
          </div>

          {/* Template Presets "Gaya Web Berbayar" */}
          <div className="space-y-2.5 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Pilih Template Preset Menu (1-Klik Terapkan):</span>
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">Pilihan format website komersial</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleApplyMenuTemplate('complete')}
                className="p-3 bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-400 rounded-xl text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
                    👑 Web Servis Komplit
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono font-bold">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Web, Panel CMS [PRO], Tanya WA [HOT], Direktori User [VIP], SOP
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleApplyMenuTemplate('ecommerce')}
                className="p-3 bg-white hover:bg-rose-50/50 border border-slate-200 hover:border-rose-400 rounded-xl text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-rose-700">
                    🛒 Servis & Toko Online
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-mono font-bold">
                    TOKO
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Katalog Servis, Panel CMS [PRO], Beli Sparepart [TOKO], Buku Manual
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleApplyMenuTemplate('membership')}
                className="p-3 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-400 rounded-xl text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    🔒 Membership VIP (Gated)
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-mono font-bold">
                    GATED
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Panduan Bebas, Area Member [LOCK], Panel Admin [PRO]
                </p>
              </button>
            </div>
          </div>

          {/* Live Header Preview */}
          <div className="p-4 bg-slate-900 rounded-xl text-slate-100 space-y-2 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau Hasil Tampilan Header Navigation:</span>
              </span>
              <span>{menusList.filter(m => m.visible).length} menu tampil</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs font-serif">
                <span>{tempSettings.siteName}</span>
                <span className="text-[9px] px-1 rounded bg-slate-900/30 text-slate-900 font-mono">PRO</span>
              </div>
              {menusList.filter(m => m.visible).map((m) => (
                <div
                  key={m.id}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  {m.target === 'custom_url' && <Globe className="w-3 h-3 text-purple-400" />}
                  {m.target === 'whatsapp' && <MessageCircle className="w-3 h-3 text-emerald-400" />}
                  {m.target === 'users' && <Users className="w-3 h-3 text-purple-400" />}
                  <span>{m.label}</span>
                  {m.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {m.badge}
                    </span>
                  )}
                  {m.requiresAuth && <Lock className="w-2.5 h-2.5 text-amber-400" />}
                  {m.target === 'custom_url' && <ExternalLink className="w-2.5 h-2.5 text-slate-500" />}
                </div>
              ))}
            </div>
          </div>

          {/* Add New Menu Form */}
          <form onSubmit={handleAddCustomMenu} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Tambah Menu Navigasi Baru</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Label / Nama Menu *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Konsultasi Teknisi..."
                  value={newMenuLabel}
                  onChange={(e) => setNewMenuLabel(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Target Halaman / Aksi
                </label>
                <select
                  value={newMenuTarget}
                  onChange={(e) => {
                    const t = e.target.value as any;
                    setNewMenuTarget(t);
                    if (t === 'whatsapp') setNewMenuBadge('HOT');
                    else if (t === 'users') setNewMenuBadge('VIP');
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                >
                  <option value="custom_url">🌐 Tautan Luar / URL Custom</option>
                  <option value="whatsapp">💬 Chat WhatsApp Konsultasi</option>
                  <option value="public">🏢 Halaman Publik (Tampilan Web)</option>
                  <option value="admin">⚡ Panel Pengelola (CMS)</option>
                  <option value="users">👥 Direktori Pengguna (User Log)</option>
                  <option value="guide">📖 Buku Panduan Pengelolaan</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Badge Label (Opsional)
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="PRO, HOT, NEW..."
                    maxLength={8}
                    value={newMenuBadge}
                    onChange={(e) => setNewMenuBadge(e.target.value.toUpperCase())}
                    className="w-full px-2.5 py-1.5 text-xs font-mono font-bold bg-white border border-slate-200 rounded-lg text-amber-700 focus:outline-none"
                  />
                  <select
                    value={newMenuBadgeColor}
                    onChange={(e) => setNewMenuBadgeColor(e.target.value as any)}
                    className="text-xs bg-white text-slate-700 border border-slate-200 rounded-lg px-2 focus:outline-none cursor-pointer"
                  >
                    <option value="amber">Emas</option>
                    <option value="emerald">Hijau</option>
                    <option value="rose">Merah</option>
                    <option value="purple">Ungu</option>
                    <option value="blue">Biru</option>
                  </select>
                </div>
              </div>

              {newMenuTarget === 'custom_url' && (
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    URL Tautan (https://...) *
                  </label>
                  <input
                    type="url"
                    placeholder="https://shopee.co.id/..."
                    value={newMenuUrl}
                    onChange={(e) => setNewMenuUrl(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambahkan Menu Ini</span>
              </button>
            </div>
          </form>

          {/* Menus List with Reorder, Edit, Auth, and Visibility */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center justify-between">
              <span>Daftar Menu Navigasi ({menusList.length}):</span>
              <span className="text-[11px] font-normal text-slate-400">Gunakan panah ⬆️ / ⬇️ untuk ubah urutan posisi</span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              {menusList.map((menu, index) => (
                <div key={menu.id} className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  
                  {/* Left: Reorder & Name */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    
                    {/* Move Up / Down Buttons */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveMenuUp(index)}
                        disabled={index === 0}
                        title="Geser menu ke atas"
                        className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveMenuDown(index)}
                        disabled={index === menusList.length - 1}
                        title="Geser menu ke bawah"
                        className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-mono text-slate-400 w-4 shrink-0">#{index + 1}</span>

                    {/* Inline Label & Badge Editing */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={menu.label}
                          onChange={(e) => handleUpdateMenuLabel(menu.id, e.target.value)}
                          className="font-semibold text-slate-900 text-xs sm:text-sm bg-slate-50 hover:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none px-2 py-1 rounded transition-colors"
                          title="Klik untuk langsung mengedit nama menu ini"
                        />
                        
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono shrink-0 ${
                          menu.target === 'custom_url' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          menu.target === 'whatsapp' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          menu.target === 'users' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {menu.target === 'custom_url' ? 'Tautan Luar' : menu.target === 'whatsapp' ? 'WhatsApp' : menu.target === 'users' ? 'User Directory' : 'Internal'}
                        </span>

                        {/* Inline Badge */}
                        <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">
                          <span className="text-[9px] text-slate-400 font-mono">BADGE:</span>
                          <input
                            type="text"
                            value={menu.badge || ''}
                            onChange={(e) => handleUpdateMenuBadge(menu.id, e.target.value.toUpperCase(), menu.badgeColor || 'amber')}
                            placeholder="PRO/HOT"
                            maxLength={8}
                            className="w-14 text-[9px] font-mono font-bold uppercase text-amber-700 bg-transparent focus:outline-none"
                          />
                        </div>

                        {menu.requiresAuth && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 font-mono">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Wajib Login</span>
                          </span>
                        )}
                      </div>

                      {menu.url && (
                        <div className="text-[11px] text-blue-600 truncate max-w-sm pl-2 mt-0.5">
                          {menu.url}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: Auth Requirement, Toggle Visibility, Delete */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    
                    {/* Toggle Auth Requirement */}
                    <button
                      type="button"
                      onClick={() => handleToggleMenuAuth(menu.id)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors flex items-center gap-1 border cursor-pointer ${
                        menu.requiresAuth
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                      title={menu.requiresAuth ? 'Klik untuk bebas masuk (tanpa login)' : 'Klik untuk mewajibkan login email'}
                    >
                      {menu.requiresAuth ? <Lock className="w-3 h-3 text-amber-600" /> : <Unlock className="w-3 h-3 text-slate-400" />}
                      <span className="text-[11px]">{menu.requiresAuth ? 'Perlu Login' : 'Bebas'}</span>
                    </button>

                    {/* Toggle Visibility */}
                    <button
                      type="button"
                      onClick={() => handleToggleMenuVisibility(menu.id)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5 border cursor-pointer ${
                        menu.visible
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {menu.visible ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{menu.visible ? 'Tampil' : 'Sembunyi'}</span>
                    </button>

                    {/* Delete Custom Menu */}
                    {!['menu-public', 'menu-admin', 'menu-guide'].includes(menu.id) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMenu(menu.id, menu.label)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus menu custom ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: GUIDES LIST */}
      {activeTab === 'guides' && (
        <div className="space-y-4">
          
          {/* Controls: Search and Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari judul artikel atau gejala..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">Kategori:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-1.5 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="Semua">Semua Kategori ({guides.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c} ({guides.filter(g => g.c === c).length})
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsBulkExcelModalOpen(true)}
                className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1 shrink-0"
                title="Input panduan kolektif dari file spreadsheet Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Input .XLS</span>
              </button>

              <button
                onClick={handleOpenCreateModal}
                className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Baru</span>
              </button>
            </div>
          </div>

          {/* Guides Cards List */}
          <div className="space-y-3">
            {cmsFilteredGuides.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
                Tidak ada panduan yang cocok dengan filter.
              </div>
            ) : (
              cmsFilteredGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded text-[11px]">
                        {guide.c}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 font-mono text-[11px]">ID: {guide.id}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{guide.s.length} langkah perbaikan</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-slate-900 truncate">
                      {guide.t}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-1">
                      {guide.g}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                      <span className="text-slate-400">Alat rekomendasi:</span>
                      <span className="font-medium text-slate-700">{guide.a}</span>
                      {guide.afUrl && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Ada Link Afiliasi
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions for this guide */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 w-full md:w-auto justify-end">
                    <button
                      onClick={() => handleDuplicateGuide(guide)}
                      className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs transition-colors flex items-center gap-1"
                      title="Duplikasi panduan ini"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Salin</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(guide)}
                      className="px-3 py-2 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteGuide(guide.id, guide.t)}
                      className="p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-xs transition-colors"
                      title="Hapus panduan ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* Tab: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-900 mb-1">
              Kelola Kategori Kerusakan
            </h2>
            <p className="text-xs text-slate-500">
              Kategori memudahkan pengunjung menyaring masalah berdasarkan jenis perangkat yang ingin diperbaiki.
            </p>
          </div>

          {/* Add Category Form */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Nama kategori baru (contoh: Komputer PC, Handphone, Monitor)..."
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Category List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Daftar Kategori Terdaftar:
            </div>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {categories.map((cat) => {
                const guideCount = guides.filter(g => g.c === cat).length;
                return (
                  <div key={cat} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <span className="font-semibold text-slate-800 text-sm">{cat}</span>
                      <span className="ml-2 text-xs text-slate-400">({guideCount} panduan)</span>
                    </div>

                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      disabled={categories.length <= 1}
                      className="text-xs text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Hapus kategori ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: SITE IDENTITY, BRANDING, SETTINGS & AFFILIATE */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          
          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4 text-amber-700" />
                </div>
                <h2 className="text-lg font-serif font-bold text-slate-900">
                  Tool Edit Identitas Situs, Nama Web & Deskripsi
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-800 border border-amber-300 font-mono font-bold px-2 py-0.5 rounded-full">
                  PRO BUILDER
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-2xl">
                Sesuaikan nama website, slogan tagline, deskripsi hero, inisial logo, pita pengumuman promo, nomor WhatsApp teknisi, dan catatan kaki secara fleksibel seperti CMS web berbayar.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {onOpenSiteEditor && (
                <button
                  type="button"
                  onClick={onOpenSiteEditor}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Buka Popup Editor Lengkap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Popup Customizer</span>
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>

          {/* 1-Click Quick Preset Templates */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Preset Paket Identitas Siap Pakai (1-Klik Terapkan):</span>
              </div>
              <span className="text-[11px] text-slate-400">Dapat diedit kembali sesuka hati</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                {
                  id: 'meja-servis',
                  title: 'Meja Servis Pro',
                  tagline: 'Solusi dari teknisi, bukan sekadar teori',
                  icon: 'Wrench',
                  badge: 'PRO',
                  badgeColor: 'amber',
                  initial: 'M',
                  desc: 'Koleksi panduan perbaikan laptop, printer, dan jaringan komputer teruji langsung di meja servis. Dilengkapi dengan panel kelola konten (CMS) termudah.',
                  announcement: '⚡ Layanan Konsultasi Cepat Teknisi Aktif: Tanya jawab diagnosa kerusakan laptop & printer via WhatsApp!',
                  hours: 'Senin - Sabtu: 08.30 - 21.00 WIB'
                },
                {
                  id: 'dokter-gadget',
                  title: 'Dokter Gadget & PC',
                  tagline: 'Pusat reparasi motherboard, upgrade & servis kilat',
                  icon: 'Laptop',
                  badge: 'OFFICIAL',
                  badgeColor: 'emerald',
                  initial: 'DG',
                  desc: 'Diagnosa akurat dan panduan perbaikan hardware laptop gaming, notebook, hingga MacBook oleh teknisi berpengalaman.',
                  announcement: '🎉 Promo Upgrade SSD & Pembersihan Thermal Pasta Diskon 20% Minggu Ini!',
                  hours: 'Setiap Hari: 09.00 - 22.00 WIB'
                },
                {
                  id: 'klinik-printer',
                  title: 'Klinik Printer Mandiri',
                  tagline: 'Solusi head mampet, blinking & infus cartridge',
                  icon: 'Cpu',
                  badge: 'EXPERT',
                  badgeColor: 'blue',
                  initial: 'KP',
                  desc: 'Database langkah perbaikan printer Epson, Canon, HP & Brother terlengkap. Solusi mandiri tanpa harus bawa ke tukang servis.',
                  announcement: '🖨️ Tutorial reset printer blinking dan penanganan paper jam terlengkap sudah diupdate!',
                  hours: 'Senin - Jumat: 08.00 - 17.00 WIB'
                },
                {
                  id: 'network-lab',
                  title: 'Network & IT Lab',
                  tagline: 'Infrastruktur jaringan, router & keamanan sistem',
                  icon: 'Server',
                  badge: 'ENTERPRISE',
                  badgeColor: 'purple',
                  initial: 'IT',
                  desc: 'Dokumentasi teknis troubleshooting jaringan kantor, crimping kabel LAN, manajemen bandwidth router, dan troubleshooting koneksi internet.',
                  announcement: '🌐 Dokumentasi konfigurasi firewall & hotspot Mikrotik telah ditambahkan.',
                  hours: '24/7 Monitoring & Support'
                }
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setTempSettings({
                      ...tempSettings,
                      siteName: preset.title,
                      tagline: preset.tagline,
                      subtitle: preset.desc,
                      logoInitial: preset.initial,
                      logoIcon: preset.icon,
                      brandBadge: preset.badge,
                      brandBadgeColor: preset.badgeColor as any,
                      announcementText: preset.announcement,
                      operatingHours: preset.hours,
                    });
                    showToast(`Preset "${preset.title}" diterapkan ke form.`);
                  }}
                  className="p-3 bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition-all group shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-amber-900 flex items-center gap-1.5 truncate">
                      {preset.icon === 'Laptop' && <Laptop className="w-3.5 h-3.5 text-slate-600" />}
                      {preset.icon === 'Cpu' && <Cpu className="w-3.5 h-3.5 text-slate-600" />}
                      {preset.icon === 'Server' && <Server className="w-3.5 h-3.5 text-slate-600" />}
                      {preset.icon === 'Wrench' && <Wrench className="w-3.5 h-3.5 text-slate-600" />}
                      <span>{preset.title}</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-100 text-slate-600">
                      {preset.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 italic">
                    "{preset.tagline}"
                  </div>
                  <div className="mt-2 text-[10px] text-amber-700 font-semibold group-hover:underline flex items-center gap-1">
                    <span>Klik Terapkan</span>
                    <span>→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Live Simulator Header Preview */}
          <div className="bg-slate-950 text-white rounded-xl p-4 border border-slate-800 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Eye className="w-3.5 h-3.5" />
                <span>SIMULASI TAMPILAN HEADER SECARA LANGSUNG:</span>
              </span>
              <span>Pratinjau Otomatis</span>
            </div>

            {/* Simulated Announcement */}
            {tempSettings.showAnnouncement && tempSettings.announcementText && (
              <div className="bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                <Megaphone className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span className="truncate">{tempSettings.announcementText}</span>
              </div>
            )}

            {/* Simulated Navbar */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold font-serif text-lg flex items-center justify-center">
                  {tempSettings.logoInitial || 'M'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-white text-base">
                      {tempSettings.siteName || 'Nama Website'}
                    </span>
                    {tempSettings.brandBadge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase border bg-amber-500/20 text-amber-300 border-amber-500/40">
                        {tempSettings.brandBadge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-sm">
                    {tempSettings.tagline || 'Tagline slogan website'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700 text-[11px]">
                  Ikon: {tempSettings.logoIcon || 'Wrench'}
                </div>
                <div className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/30 text-[11px] flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-emerald-400" />
                  <span>WA: {tempSettings.whatsappNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Controls Grid */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-6">
            
            {/* Section 1: Brand & Hero */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                <span>1. Identitas Brand, Nama & Deskripsi Hero</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Site Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nama Website (Site Name) *
                  </label>
                  <input
                    type="text"
                    value={tempSettings.siteName}
                    onChange={(e) => setTempSettings({ ...tempSettings, siteName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    placeholder="Contoh: Meja Servis"
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Nama utama yang tampil di logo, header, dan browser tab title.
                  </span>
                </div>

                {/* Tagline */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tagline / Motto Singkat
                  </label>
                  <input
                    type="text"
                    value={tempSettings.tagline}
                    onChange={(e) => setTempSettings({ ...tempSettings, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    placeholder="Contoh: Solusi dari teknisi, bukan sekadar teori"
                  />
                </div>

                {/* Subtitle / Hero Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Deskripsi Lengkap / Subtitle Hero *
                  </label>
                  <textarea
                    rows={3}
                    value={tempSettings.subtitle}
                    onChange={(e) => setTempSettings({ ...tempSettings, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 leading-relaxed"
                    placeholder="Koleksi panduan perbaikan laptop, printer, dan jaringan komputer..."
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Paragraf pengantar yang tampil di banner utama halaman publik (Hero Section).
                  </span>
                </div>

                {/* Logo Initial */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Inisial Huruf Logo (Kotak Kuning)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={tempSettings.logoInitial || 'M'}
                    onChange={(e) => setTempSettings({ ...tempSettings, logoInitial: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 text-sm font-serif font-bold text-center bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>

                {/* Logo Icon */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Pilihan Ikon Logo
                  </label>
                  <select
                    value={tempSettings.logoIcon || 'Wrench'}
                    onChange={(e) => setTempSettings({ ...tempSettings, logoIcon: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 cursor-pointer focus:outline-none"
                  >
                    <option value="Wrench">🔧 Kunci Pas (Wrench)</option>
                    <option value="Laptop">💻 Laptop & Notebook</option>
                    <option value="Cpu">⚡ Chipset Komponen (Cpu)</option>
                    <option value="Shield">🛡️ Keamanan & Perlindungan (Shield)</option>
                    <option value="Server">🌐 Server & Jaringan Komputer</option>
                    <option value="Smartphone">📱 Smartphone & Gadget</option>
                    <option value="Zap">⚡ Kilat / Fast Service</option>
                    <option value="Flame">🔥 Populer (Flame)</option>
                    <option value="Crown">👑 Mahkota (Crown)</option>
                    <option value="Sparkles">✨ Pro & Modern (Sparkles)</option>
                  </select>
                </div>

                {/* Brand Badge Label */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Badge Header Brand (Opsional)
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={tempSettings.brandBadge || 'PRO'}
                    onChange={(e) => setTempSettings({ ...tempSettings, brandBadge: e.target.value.toUpperCase() })}
                    placeholder="PRO, OFFICIAL, VIP..."
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl text-amber-700 focus:outline-none"
                  />
                </div>

                {/* Brand Badge Color */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Warna Badge Brand
                  </label>
                  <select
                    value={tempSettings.brandBadgeColor || 'amber'}
                    onChange={(e) => setTempSettings({ ...tempSettings, brandBadgeColor: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 cursor-pointer focus:outline-none"
                  >
                    <option value="amber">Emas / Amber</option>
                    <option value="emerald">Hijau / Emerald</option>
                    <option value="rose">Merah / Rose</option>
                    <option value="purple">Ungu / Purple</option>
                    <option value="blue">Biru / Sky</option>
                    <option value="slate">Abu-abu / Slate</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Section 2: Announcement Top Bar */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-sky-600" />
                  <span>2. Banner Promo & Pengumuman Puncak (Top Announcement)</span>
                </h3>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.showAnnouncement ?? true}
                    onChange={(e) => setTempSettings({ ...tempSettings, showAnnouncement: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {tempSettings.showAnnouncement && (
                <div className="p-4 bg-sky-50/50 border border-sky-200 rounded-xl space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Teks Banner Pengumuman *
                    </label>
                    <textarea
                      rows={2}
                      value={tempSettings.announcementText || ''}
                      onChange={(e) => setTempSettings({ ...tempSettings, announcementText: e.target.value })}
                      placeholder="Contoh: ⚡ Layanan Konsultasi Cepat Teknisi Aktif: Tanya jawab diagnosa kerusakan laptop & printer via WhatsApp!"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Warna Tema Banner
                      </label>
                      <select
                        value={tempSettings.announcementColor || 'amber'}
                        onChange={(e) => setTempSettings({ ...tempSettings, announcementColor: e.target.value as any })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg cursor-pointer"
                      >
                        <option value="amber">Emas / Amber (Promo Utama)</option>
                        <option value="emerald">Hijau / Emerald (Aktif / Online)</option>
                        <option value="blue">Biru / Sky (Informasi Baru)</option>
                        <option value="purple">Ungu / Purple (Spesial VIP)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Tautan Klik Banner (Opsional URL)
                      </label>
                      <input
                        type="url"
                        value={tempSettings.announcementLink || ''}
                        onChange={(e) => setTempSettings({ ...tempSettings, announcementLink: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: WhatsApp & Contact Integration */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>3. Integrasi WhatsApp & Jam Kerja Layanan</span>
              </h3>

              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-950 mb-1">
                      Nomor WhatsApp Teknisi (format 628xxx tanpa + atau spasi) *
                    </label>
                    <input
                      type="text"
                      value={tempSettings.whatsappNumber}
                      onChange={(e) => setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })}
                      placeholder="6281234567890"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm font-mono bg-white border border-emerald-300 rounded-lg focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-950 mb-1">
                      Jam Operasional Servis
                    </label>
                    <input
                      type="text"
                      value={tempSettings.operatingHours || ''}
                      onChange={(e) => setTempSettings({ ...tempSettings, operatingHours: e.target.value })}
                      placeholder="Senin - Sabtu: 08.30 - 21.00 WIB"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-emerald-300 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-950 mb-1">
                    Awalan Pesan Chat WhatsApp Otomatis
                  </label>
                  <input
                    type="text"
                    value={tempSettings.whatsappMessage}
                    onChange={(e) => setTempSettings({ ...tempSettings, whatsappMessage: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-emerald-300 rounded-lg focus:outline-none"
                    placeholder="Halo Meja Servis, saya mau konsultasi masalah kerusakan perangkat saya: "
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Monetization (Google AdSense) */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    <span>Slot Iklan (Google AdSense / Banner Afiliasi)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempSettings.enableAds}
                      onChange={(e) => setTempSettings({ ...tempSettings, enableAds: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                {tempSettings.enableAds && (
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Keterangan / Kode Iklan
                    </label>
                    <input
                      type="text"
                      value={tempSettings.adText}
                      onChange={(e) => setTempSettings({ ...tempSettings, adText: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 5: Footer & Legal */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>4. Catatan Kaki (Disclaimer & Hak Cipta)</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Kaki (Disclaimer Keselamatan Servis)
                </label>
                <textarea
                  rows={2}
                  value={tempSettings.footerDisclaimer}
                  onChange={(e) => setTempSettings({ ...tempSettings, footerDisclaimer: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teks Hak Cipta (Copyright Notice)
                </label>
                <input
                  type="text"
                  value={tempSettings.footerCopyright || 'Semua hak cipta dilindungi.'}
                  onChange={(e) => setTempSettings({ ...tempSettings, footerCopyright: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  placeholder="Semua hak cipta dilindungi."
                />
              </div>
            </div>

          </div>

          {/* Bottom Save Action */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Semua perubahan nama web, deskripsi & identitas langsung tersimpan di LocalStorage & berlaku ke semua pengunjung.
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Seluruh Identitas Web</span>
            </button>
          </div>

        </form>
      )}

      {/* Tab: BACKUP & EXPORT */}
      {activeTab === 'backup' && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-serif font-bold text-slate-900 mb-1">
              Cadangkan & Sinkronkan Data
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Data artikel dan seluruh pengguna tersimpan di browser komputer ini (LocalStorage). Gunakan fitur ekspor di bawah untuk memindahkan artikel dan akun user ke komputer lain.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/50 space-y-3">
                <div className="flex items-center gap-2 text-emerald-950 font-semibold text-sm">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>Input Kolektif Excel (.XLS)</span>
                </div>
                <p className="text-xs text-emerald-800">
                  Input banyak panduan sekaligus dari file Excel (.xls / .xlsx / .csv) atau download template.
                </p>
                <div className="space-y-1.5 pt-1">
                  <button
                    onClick={() => setIsBulkExcelModalOpen(true)}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File Excel (.xls)</span>
                  </button>
                  <button
                    onClick={handleExportGuidesToExcel}
                    className="w-full py-1.5 px-3 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor Panduan ke .XLSX</span>
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Download className="w-4 h-4 text-amber-600" />
                  <span>Unduh Backup JSON</span>
                </div>
                <p className="text-xs text-slate-500">
                  Simpan seluruh isi panduan, kategori, pengguna, dan pengaturan ke file JSON.
                </p>
                <button
                  onClick={handleExportJSON}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File JSON</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Pulihkan File JSON</span>
                </div>
                <p className="text-xs text-slate-500">
                  Unggah file backup yang pernah disimpan sebelumnya untuk memulihkan seluruh data.
                </p>
                <label className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih File Backup JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>

            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-800">Salin Data JSON ke Clipboard</div>
                <div className="text-[11px] text-slate-500">Bisa langsung ditempel ke kode sumber jika ingin hardcode.</div>
              </div>
              <button
                onClick={handleCopyJSON}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Data JSON</span>
              </button>
            </div>
          </div>

          {/* Reset to Factory Defaults */}
          <div className="bg-red-50/60 border border-red-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-red-800 font-semibold text-sm mb-1">
                <AlertCircle className="w-4 h-4" />
                <span>Kembalikan ke Contoh Data Bawaan</span>
              </div>
              <p className="text-xs text-red-700 max-w-lg">
                Menghapus perubahan lokal dan memuat ulang 8 panduan perbaikan laptop, printer, dan jaringan asli teknisi.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Yakin ingin mereset seluruh data kembali ke data contoh bawaan?')) {
                  onResetDefault();
                  showToast('Data berhasil direset ke bawaan pabrik.');
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Bawaan</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Form Add or Edit Guide */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full my-8 overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <div className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                  {editingId ? 'Mode Edit Panduan' : 'Tambah Panduan Baru'}
                </div>
                <h3 className="font-serif font-bold text-lg text-white">
                  {editingId ? 'Perbarui Solusi Masalah' : 'Tulis Solusi Masalah Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Templates Bar (if creating new) */}
            {!editingId && (
              <div className="bg-amber-50/70 border-b border-amber-200/80 px-6 py-2.5 flex items-center gap-2 overflow-x-auto text-xs">
                <span className="font-semibold text-amber-900 flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Template Cepat:</span>
                </span>
                {TEMPLATES_QUICK_ADD.map((tmpl) => (
                  <button
                    key={tmpl.t}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-950 border border-amber-200 rounded-md transition-colors shrink-0 text-[11px]"
                  >
                    + {tmpl.t.slice(0, 30)}...
                  </button>
                ))}
              </div>
            )}

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitGuide} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Perangkat *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Masalah / Kerusakan *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Layar Laptop Bergaris atau Flicker..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Gejala Kerusakan *
                </label>
                <textarea
                  rows={2}
                  value={formGejala}
                  onChange={(e) => setFormGejala(e.target.value)}
                  placeholder="Jelaskan apa yang dirasakan pengguna, lampu apa yang menyala/mati, bunyi apa yang terdengar..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  required
                />
              </div>

              {/* Dynamic Causes List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Kemungkinan Penyebab (Poin)
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormPenyebab([...formPenyebab, ''])}
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Penyebab</span>
                  </button>
                </div>
                {formPenyebab.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-4">{idx + 1}.</span>
                    <input
                      type="text"
                      value={p}
                      onChange={(e) => {
                        const next = [...formPenyebab];
                        next[idx] = e.target.value;
                        setFormPenyebab(next);
                      }}
                      placeholder={`Penyebab ${idx + 1}...`}
                      className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg"
                    />
                    {formPenyebab.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFormPenyebab(formPenyebab.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Dynamic Steps List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Langkah-Langkah Perbaikan (SOP Teknisi) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormLangkah([...formLangkah, ''])}
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Langkah</span>
                  </button>
                </div>
                {formLangkah.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-1.5 font-mono">
                      {idx + 1}
                    </span>
                    <textarea
                      rows={2}
                      value={s}
                      onChange={(e) => {
                        const next = [...formLangkah];
                        next[idx] = e.target.value;
                        setFormLangkah(next);
                      }}
                      placeholder={`Langkah ke-${idx + 1}...`}
                      className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                    {formLangkah.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFormLangkah(formLangkah.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-500 p-1 mt-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Danger / When to Technician Warning */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Peringatan / Kapan Harus ke Teknisi Profesional *
                </label>
                <input
                  type="text"
                  value={formTeknisi}
                  onChange={(e) => setFormTeknisi(e.target.value)}
                  placeholder="Contoh: Jika ada bau gosong atau lampu motherboard tidak menyala..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-amber-50/50 border border-amber-200 rounded-lg text-amber-950 focus:outline-none"
                  required
                />
              </div>

              {/* Tools & Affiliate Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Alat Bantu yang Direkomendasikan
                  </label>
                  <input
                    type="text"
                    value={formAlat}
                    onChange={(e) => setFormAlat(e.target.value)}
                    placeholder="Contoh: Obeng presisi, SSD SATA, Pasta prosesor..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tautan Belanja Afiliasi (Shopee / Tokopedia)
                  </label>
                  <input
                    type="url"
                    value={formAfUrl}
                    onChange={(e) => setFormAfUrl(e.target.value)}
                    placeholder="https://shopee.co.id/..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Photo Upload / Image URL */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Foto / Ilustrasi Gejala (Opsional)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="Masukkan URL foto atau upload file di samping..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg w-full"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {formImageUrl && (
                  <div className="relative inline-block mt-2">
                    <img
                      src={formImageUrl}
                      alt="Pratinjau"
                      className="h-20 w-auto rounded-lg border border-slate-200 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('')}
                      className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingId ? 'Simpan Perubahan' : 'Terbitkan Panduan'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add User Manual */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full my-8 overflow-hidden shadow-2xl animate-scale-up">
            
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <div className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                  Admin & User Directory
                </div>
                <h3 className="font-serif font-bold text-lg text-white">
                  Daftarkan Pengguna Baru
                </h3>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserManual} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Nama teknisi / pelanggan..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Akun *
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hak Akses (Role)
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="member">Member</option>
                    <option value="technician">Teknisi</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Minat Perangkat
                  </label>
                  <select
                    value={newUserInterest}
                    onChange={(e) => setNewUserInterest(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Semua Perangkat">Semua</option>
                    <option value="Laptop & PC">Laptop</option>
                    <option value="Printer">Printer</option>
                    <option value="Jaringan">Jaringan</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftarkan User</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: Bulk Excel Import (.xls / .xlsx / .csv) */}
      <BulkExcelImportModal
        isOpen={isBulkExcelModalOpen}
        onClose={() => setIsBulkExcelModalOpen(false)}
        categories={categories}
        onImportSuccess={handleBulkExcelImportSuccess}
      />

    </div>
  );
};
