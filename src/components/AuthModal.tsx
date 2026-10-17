import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { AppUser, UserActivityLog } from '../data/authTypes';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  allUsers: AppUser[];
  onLoginSuccess: (user: AppUser, isNew: boolean) => void;
  onAddLog: (action: UserActivityLog['action'], details: string, user: AppUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  allUsers,
  onLoginSuccess,
  onAddLog,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deviceInterest, setDeviceInterest] = useState('Semua Perangkat');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setErrorMsg('Silakan isi email dan password Anda');
      return;
    }

    // Check if user already exists
    const existing = allUsers.find(u => u.email.toLowerCase() === trimmedEmail);
    const now = new Date().toLocaleString('id-ID', { hour12: false });

    if (existing) {
      const updatedUser: AppUser = {
        ...existing,
        lastLoginAt: now,
      };
      onLoginSuccess(updatedUser, false);
      onAddLog('login', `Login melalui email: ${trimmedEmail}`, updatedUser);
      onClose();
    } else {
      // Create new user automatically if not found (Passwordless/auto-record or prompt)
      const newUser: AppUser = {
        id: `u-${Date.now()}`,
        email: trimmedEmail,
        name: trimmedEmail.split('@')[0],
        role: trimmedEmail.includes('admin') || trimmedEmail === 'masimamsaiful@gmail.com' ? 'admin' : 'member',
        createdAt: now,
        lastLoginAt: now,
        savedGuideIds: [],
        deviceInterest: 'Semua Perangkat',
        status: 'active'
      };
      onLoginSuccess(newUser, true);
      onAddLog('register', `Pendaftaran akun otomatis saat login: ${trimmedEmail}`, newUser);
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedName || !password) {
      setErrorMsg('Nama, email, dan password wajib diisi');
      return;
    }

    // Check if already registered
    const existing = allUsers.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      setErrorMsg('Email ini sudah terdaftar. Silakan pindah ke tab Masuk.');
      return;
    }

    const now = new Date().toLocaleString('id-ID', { hour12: false });
    const newUser: AppUser = {
      id: `u-${Date.now()}`,
      email: trimmedEmail,
      name: trimmedName,
      phone: phone.trim() || undefined,
      role: trimmedEmail === 'masimamsaiful@gmail.com' ? 'admin' : 'member',
      createdAt: now,
      lastLoginAt: now,
      savedGuideIds: [],
      deviceInterest,
      status: 'active'
    };

    onLoginSuccess(newUser, true);
    onAddLog('register', `Pendaftaran akun member baru: ${trimmedName} (${trimmedEmail})`, newUser);
    onClose();
  };

  // Quick 1-click login helper
  const handleQuickLogin = (quickEmail: string) => {
    const target = allUsers.find(u => u.email === quickEmail);
    const now = new Date().toLocaleString('id-ID', { hour12: false });
    if (target) {
      const updated = { ...target, lastLoginAt: now };
      onLoginSuccess(updated, false);
      onAddLog('login', `Login instan sebagai ${target.name}`, updated);
      onClose();
    } else {
      setEmail(quickEmail);
      setPassword('password123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full my-8 overflow-hidden shadow-2xl animate-scale-up">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Sistem Akun & Rekam Pengguna</span>
          </div>

          <h2 className="font-serif font-bold text-xl sm:text-2xl text-white">
            {tab === 'login' ? 'Masuk ke Meja Servis' : 'Daftar Akun Pengguna'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Data login terekam otomatis di direktori pengguna untuk histori konsultasi & bookmark perbaikan.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold text-center transition-colors border-b-2 ${
              tab === 'login'
                ? 'border-amber-600 text-amber-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Masuk (Login Email)
          </button>

          <button
            onClick={() => {
              setTab('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold text-center transition-colors border-b-2 ${
              tab === 'register'
                ? 'border-amber-600 text-amber-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Daftar Akun Baru
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <span className="font-bold">Perhatian:</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter..."
                    className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Test Login Accounts */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Akun Cepat (Langsung Coba):
                </div>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('masimamsaiful@gmail.com')}
                    className="w-full py-1.5 px-2.5 bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-200 rounded-lg text-left text-xs transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">masimamsaiful@gmail.com</span>
                      <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded ml-1.5 font-bold">Admin</span>
                    </div>
                    <span className="text-[11px] text-amber-700 font-medium">Masuk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('dian.lestari@gmail.com')}
                    className="w-full py-1.5 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-700">dian.lestari@gmail.com</span>
                      <span className="text-[10px] text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded ml-1.5">Member</span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium">Masuk</span>
                  </button>
                </div>
              </div>

            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Email Aktif *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="budi@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp / HP (Opsional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Berguna agar teknisi mudah mengonfirmasi jadwal atau konsultasi servis.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password Baru *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Minat Perangkat Utama
                </label>
                <select
                  value={deviceInterest}
                  onChange={(e) => setDeviceInterest(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                >
                  <option value="Semua Perangkat">Semua Perangkat (Laptop, Printer, Jaringan)</option>
                  <option value="Laptop & PC">Laptop & PC Saja</option>
                  <option value="Printer">Printer & Tinta</option>
                  <option value="Jaringan & Wi-Fi">Jaringan & Wi-Fi</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Daftar & Rekam Akun Saya</span>
                <Check className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
