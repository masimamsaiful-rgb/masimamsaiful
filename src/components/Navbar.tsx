import React, { useState } from 'react';
import { 
  Wrench, 
  LayoutDashboard, 
  BookOpen, 
  Eye, 
  LogIn, 
  LogOut, 
  Users, 
  ChevronDown, 
  ExternalLink, 
  Lock, 
  Unlock, 
  Globe, 
  Sparkles,
  Crown,
  MessageCircle,
  Shield,
  Zap,
  ShoppingCart,
  Sliders,
  Edit3,
  Megaphone
} from 'lucide-react';
import { AppUser } from '../data/authTypes';
import { NavMenuItem } from '../data/defaultGuides';

interface NavbarProps {
  currentTab: 'public' | 'admin' | 'guide';
  setCurrentTab: (tab: 'public' | 'admin' | 'guide') => void;
  guidesCount: number;
  siteName: string;
  currentUser: AppUser | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  totalUsersCount: number;
  navMenus?: NavMenuItem[];
  accessMode?: 'free' | 'gated';
  onToggleAccessMode?: () => void;
  requireLoginForCMS?: boolean;
  onOpenMenuEditor?: () => void;
  onSelectAdminTab?: (tab: string) => void;
  onOpenSiteEditor?: () => void;
  logoInitial?: string;
  logoIcon?: string;
  brandBadge?: string;
  brandBadgeColor?: string;
  tagline?: string;
}

const BADGE_COLOR_MAP: Record<string, string> = {
  amber: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  rose: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  purple: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  blue: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  slate: 'bg-slate-700/60 text-slate-300 border-slate-600',
};

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  guidesCount,
  siteName,
  currentUser,
  onOpenAuthModal,
  onLogout,
  totalUsersCount,
  navMenus = [
    { id: 'menu-public', label: 'Tampilan Web', target: 'public', visible: true, icon: 'Eye' },
    { id: 'menu-admin', label: 'Panel CMS', target: 'admin', visible: true, requiresAuth: false, icon: 'LayoutDashboard', badge: 'PRO', badgeColor: 'amber' },
    { id: 'menu-guide', label: 'Panduan Pengelolaan', target: 'guide', visible: true, icon: 'BookOpen' },
  ],
  accessMode = 'free',
  onToggleAccessMode,
  requireLoginForCMS = false,
  onOpenMenuEditor,
  onSelectAdminTab,
  onOpenSiteEditor,
  logoInitial,
  logoIcon,
  brandBadge,
  brandBadgeColor,
  tagline
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleMenuClick = (menu: NavMenuItem) => {
    if (menu.requiresAuth && !currentUser) {
      onOpenAuthModal();
      return;
    }

    if (menu.target === 'admin') {
      if (requireLoginForCMS && (!currentUser || currentUser.role === 'member')) {
        onOpenAuthModal();
        return;
      }
      setCurrentTab('admin');
      return;
    }

    if (menu.target === 'users') {
      if (requireLoginForCMS && (!currentUser || currentUser.role === 'member')) {
        onOpenAuthModal();
        return;
      }
      setCurrentTab('admin');
      if (onSelectAdminTab) {
        onSelectAdminTab('users');
      }
      return;
    }

    if (menu.target === 'public') {
      setCurrentTab('public');
      return;
    }

    if (menu.target === 'guide') {
      setCurrentTab('guide');
      return;
    }

    if (menu.target === 'whatsapp') {
      if (menu.url) {
        window.open(menu.url, '_blank', 'noopener,noreferrer');
      }
      return;
    }
  };

  const visibleMenus = navMenus.filter(m => m.visible);

  const renderMenuIcon = (iconName?: string, target?: string) => {
    switch (iconName) {
      case 'Eye':
        return <Eye className="w-4 h-4 text-slate-400" />;
      case 'LayoutDashboard':
        return <LayoutDashboard className="w-4 h-4 text-amber-400" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-sky-400" />;
      case 'MessageCircle':
        return <MessageCircle className="w-4 h-4 text-emerald-400" />;
      case 'Users':
        return <Users className="w-4 h-4 text-purple-400" />;
      case 'Wrench':
        return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'Shield':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'Crown':
        return <Crown className="w-4 h-4 text-amber-400" />;
      case 'ShoppingCart':
        return <ShoppingCart className="w-4 h-4 text-rose-400" />;
      case 'Globe':
        return <Globe className="w-4 h-4 text-indigo-400" />;
      default:
        if (target === 'admin') return <LayoutDashboard className="w-4 h-4 text-amber-400" />;
        if (target === 'guide') return <BookOpen className="w-4 h-4 text-sky-400" />;
        if (target === 'users') return <Users className="w-4 h-4 text-purple-400" />;
        if (target === 'whatsapp') return <MessageCircle className="w-4 h-4 text-emerald-400" />;
        if (target === 'custom_url') return <Globe className="w-4 h-4 text-purple-400" />;
        return <Eye className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 backdrop-blur-md bg-slate-900/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand Zone (Selector 1 target: div:nth-of-type(2) > div:nth-of-type(1)) */}
        <div 
          onClick={() => setCurrentTab('public')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 font-bold font-serif text-xl flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
            {logoInitial || siteName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-serif font-bold text-lg sm:text-xl text-white tracking-tight flex items-center gap-2">
              <span className="truncate">{siteName}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-sans font-bold tracking-wider hidden md:inline-flex items-center gap-1 shadow-2xs border ${BADGE_COLOR_MAP[brandBadgeColor || 'amber'] || BADGE_COLOR_MAP.amber}`}>
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>{brandBadge || 'PRO'}</span>
              </span>
              {onOpenSiteEditor && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSiteEditor();
                  }}
                  title="Tool Edit Nama Web, Deskripsi & Logo"
                  className="opacity-70 group-hover:opacity-100 hover:text-amber-300 p-1 rounded hover:bg-slate-800 transition-all text-slate-400 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block leading-none -mt-0.5 truncate max-w-xs">
              {tagline || 'Solusi teknisi laptop, printer & jaringan'}
            </div>
          </div>
        </div>

        {/* Access Mode Indicator & Quick Switcher */}
        <div className="hidden lg:flex items-center">
          {onToggleAccessMode ? (
            <button
              onClick={onToggleAccessMode}
              title={`Klik untuk ubah mode akses (Saat ini: ${accessMode === 'gated' ? 'Wajib Login Email' : 'Free Bebas Masuk'})`}
              className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full border transition-all cursor-pointer ${
                accessMode === 'gated'
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                  : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
              }`}
            >
              {accessMode === 'gated' ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Akses: Perlu Login Email</span>
                  <span className="text-[10px] bg-amber-400/20 px-1 rounded ml-1 text-amber-200">Ubah</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Akses: Free Langsung Masuk</span>
                  <span className="text-[10px] bg-emerald-400/20 px-1 rounded ml-1 text-emerald-200">Ubah</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border border-slate-700 bg-slate-800/80 text-slate-300">
              {accessMode === 'gated' ? (
                <>
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Akses: Perlu Login Email</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3 h-3 text-emerald-400" />
                  <span>Akses: Free Langsung Masuk</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Nav Links from navMenus (Selector 2 target: nav > button:nth-of-type(2) > span:nth-of-type(1)) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {visibleMenus.map((menu) => {
            const isTabActive = 
              (menu.target === 'public' && currentTab === 'public') ||
              (menu.target === 'admin' && currentTab === 'admin') ||
              (menu.target === 'guide' && currentTab === 'guide');

            const badgeStyle = BADGE_COLOR_MAP[menu.badgeColor || 'amber'] || BADGE_COLOR_MAP.amber;

            if (menu.target === 'custom_url') {
              return (
                <a
                  key={menu.id}
                  href={menu.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap text-slate-300 hover:text-white hover:bg-slate-800/60"
                >
                  {renderMenuIcon(menu.icon, menu.target)}
                  <span>{menu.label}</span>
                  {menu.badge && (
                    <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold uppercase border ${badgeStyle}`}>
                      {menu.badge}
                    </span>
                  )}
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              );
            }

            if (menu.target === 'whatsapp') {
              return (
                <a
                  key={menu.id}
                  href={menu.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap text-emerald-300 hover:text-emerald-200 hover:bg-emerald-950/40 border border-emerald-500/30"
                >
                  {renderMenuIcon(menu.icon, menu.target)}
                  <span>{menu.label}</span>
                  {menu.badge && (
                    <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold uppercase border ${badgeStyle}`}>
                      {menu.badge}
                    </span>
                  )}
                </a>
              );
            }

            return (
              <button
                key={menu.id}
                onClick={() => handleMenuClick(menu)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  isTabActive
                    ? menu.target === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                      : 'bg-slate-800 text-amber-400 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {renderMenuIcon(menu.icon, menu.target)}

                {/* Target span for Selector 2 */}
                <span>{menu.label}</span>

                {/* Menu Badge (e.g. PRO, HOT, NEW, VIP) */}
                {menu.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase border ${badgeStyle}`}>
                    {menu.badge}
                  </span>
                )}

                {menu.requiresAuth && !currentUser && (
                  <span title="Wajib login email">
                    <Lock className="w-3 h-3 text-amber-400" />
                  </span>
                )}

                {menu.target === 'admin' && (
                  <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded-full font-mono hidden md:inline">
                    {guidesCount}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick "👑 Editor Menu (PRO)" button right in the header for commercial website ease */}
          {onOpenMenuEditor && (
            <button
              onClick={onOpenMenuEditor}
              className="px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-1.5 shrink-0 shadow-2xs hover:scale-102 cursor-pointer"
              title="Buka Editor Menu Dashboard (Gaya Web Berbayar)"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Editor Menu</span>
              <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1 rounded font-mono">
                PRO
              </span>
            </button>
          )}

          {/* Quick "🎨 Edit Info Web" button right in the header */}
          {onOpenSiteEditor && (
            <button
              onClick={onOpenSiteEditor}
              className="px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 shrink-0 shadow-2xs hover:scale-102 cursor-pointer"
              title="Tool Edit Nama Web, Deskripsi, Logo & Banner Promo"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden lg:inline">Edit Web</span>
            </button>
          )}
        </nav>

        {/* User Account & Login Menu */}
        <div className="flex items-center gap-2 shrink-0">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 sm:gap-2 py-1 px-2 sm:px-2.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
                title={`Akun aktif: ${currentUser.name} (${currentUser.role})`}
              >
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[11px] shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-slate-200 truncate max-w-[110px] leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-amber-400 capitalize leading-tight">
                    {currentUser.role}
                  </div>
                </div>
                <div className="sm:hidden text-[10px] text-amber-400 font-semibold uppercase leading-tight">
                  {currentUser.role}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3.5 py-2 border-b border-slate-700">
                    <div className="font-bold text-white truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {currentUser.role}
                      </span>
                      {currentUser.phone && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {currentUser.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setCurrentTab('admin');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-700/60 text-slate-200 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                      <span>Panel CMS Dashboard</span>
                    </button>

                    {onOpenMenuEditor && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenMenuEditor();
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-700/60 text-amber-300 flex items-center gap-2 font-medium"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>Editor Menu Dashboard (PRO)</span>
                      </button>
                    )}

                    {onOpenSiteEditor && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenSiteEditor();
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-700/60 text-slate-200 flex items-center gap-2 cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit Identitas & Info Web</span>
                      </button>
                    )}
                    {onToggleAccessMode && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onToggleAccessMode();
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-700/60 text-slate-200 flex items-center gap-2"
                      >
                        {accessMode === 'gated' ? (
                          <>
                            <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Ganti ke Mode: Free Masuk</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Ganti ke Mode: Wajib Login</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-700 pt-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenAuthModal();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-700/60 text-slate-300 flex items-center gap-2"
                    >
                      <LogIn className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ganti / Masuk Akun Lain</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-red-500/10 text-red-400 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Email</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
