import React, { useState, useEffect } from 'react';
import { 
  INITIAL_GUIDES, 
  DEFAULT_SITE_SETTINGS, 
  GuideItem, 
  SiteSettings 
} from './data/defaultGuides';
import { 
  INITIAL_USERS, 
  INITIAL_ACTIVITY_LOGS, 
  AppUser, 
  UserActivityLog 
} from './data/authTypes';
import { Navbar } from './components/Navbar';
import { PublicView } from './components/PublicView';
import { AdminCMS } from './components/AdminCMS';
import { ManagementGuide } from './components/ManagementGuide';
import { AuthModal } from './components/AuthModal';
import { MenuEditorModal } from './components/MenuEditorModal';
import { SiteIdentityEditorModal } from './components/SiteIdentityEditorModal';

const STORAGE_KEYS = {
  GUIDES: 'meja_servis_guides_v1',
  CATEGORIES: 'meja_servis_categories_v1',
  SETTINGS: 'meja_servis_settings_v1',
  USERS: 'meja_servis_users_v1',
  LOGS: 'meja_servis_logs_v1',
  CURRENT_USER: 'meja_servis_current_user_v1',
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'public' | 'admin' | 'guide'>('public');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuEditorOpen, setIsMenuEditorOpen] = useState(false);
  const [isSiteEditorOpen, setIsSiteEditorOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState<'guides' | 'users' | 'menus' | 'categories' | 'settings' | 'backup' | undefined>(undefined);

  // Guides State with LocalStorage Persistence
  const [guides, setGuides] = useState<GuideItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GUIDES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading guides from localStorage', e);
    }
    return INITIAL_GUIDES;
  });

  // Categories State
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading categories from localStorage', e);
    }
    return ['Laptop', 'Printer', 'Jaringan'];
  });

  // Settings State
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.siteName) return parsed;
      }
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    }
    return DEFAULT_SITE_SETTINGS;
  });

  // Users Directory State (All registered users)
  const [allUsers, setAllUsers] = useState<AppUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading users from localStorage', e);
    }
    return INITIAL_USERS;
  });

  // User Activity Audit Logs
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading logs from localStorage', e);
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  // Currently Authenticated User (Defaults to Super Admin masimamsaiful@gmail.com for ease of access)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) return parsed;
      }
    } catch (e) {
      console.error('Error loading current user from localStorage', e);
    }
    // Default to the first pre-seeded admin user
    return INITIAL_USERS[0];
  });

  // Initial editing guide if requested from public view
  const [initialEditingGuide, setInitialEditingGuide] = useState<GuideItem | null>(null);

  // Sync to LocalStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(guides));
    } catch (e) {
      console.error('Failed to save guides to localStorage', e);
    }
  }, [guides]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
    } catch (e) {
      console.error('Failed to save users to localStorage', e);
    }
  }, [allUsers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(activityLogs));
    } catch (e) {
      console.error('Failed to save logs to localStorage', e);
    }
  }, [activityLogs]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.error('Failed to save current user to localStorage', e);
    }
  }, [currentUser]);

  // Log an activity helper
  const handleAddActivityLog = (
    action: UserActivityLog['action'], 
    details: string, 
    userOverride?: AppUser
  ) => {
    const actor = userOverride || currentUser;
    if (!actor) return;
    const newLog: UserActivityLog = {
      id: `log-${Date.now()}`,
      userId: actor.id,
      userEmail: actor.email,
      userName: actor.name,
      action,
      details,
      timestamp: new Date().toLocaleString('id-ID', { hour12: false })
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep last 100 logs
  };

  // Auth Handlers
  const handleLoginSuccess = (user: AppUser, isNew: boolean) => {
    setCurrentUser(user);
    if (isNew) {
      setAllUsers(prev => [user, ...prev]);
    } else {
      setAllUsers(prev => prev.map(u => u.id === user.id ? user : u));
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      handleAddActivityLog('logout', `Keluar dari sesi akun: ${currentUser.email}`);
    }
    setCurrentUser(null);
  };

  // Toggle bookmark guide for current user
  const handleToggleSaveGuide = (guideId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const currentSaved = currentUser.savedGuideIds || [];
    const isSaved = currentSaved.includes(guideId);
    const nextSaved = isSaved 
      ? currentSaved.filter(id => id !== guideId)
      : [...currentSaved, guideId];

    const updatedUser: AppUser = {
      ...currentUser,
      savedGuideIds: nextSaved,
    };

    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    handleAddActivityLog(
      'save_guide', 
      isSaved ? `Menghapus bookmark panduan ID: ${guideId}` : `Menyimpan bookmark panduan ID: ${guideId}`,
      updatedUser
    );
  };

  const handleResetDefault = () => {
    setGuides(INITIAL_GUIDES);
    setCategories(['Laptop', 'Printer', 'Jaringan']);
    setSettings(DEFAULT_SITE_SETTINGS);
    setAllUsers(INITIAL_USERS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setCurrentUser(INITIAL_USERS[0]);
    try {
      localStorage.removeItem(STORAGE_KEYS.GUIDES);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.LOGS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (e) {
      // ignore
    }
  };

  const handleEditGuideFromPublic = (guide: GuideItem) => {
    setInitialEditingGuide(guide);
    setCurrentTab('admin');
  };

  const handleToggleAccessMode = () => {
    const nextMode = settings.accessMode === 'free' ? 'gated' : 'free';
    const updatedSettings: SiteSettings = {
      ...settings,
      accessMode: nextMode,
    };
    setSettings(updatedSettings);
    handleAddActivityLog(
      'access_mode_change',
      `Mengubah mode akses pengunjung situs menjadi: ${nextMode === 'free' ? 'Free (Bebas Masuk)' : 'Wajib Login Email (Gated)'}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* Top Header Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab !== 'admin') {
            setInitialEditingGuide(null);
            setAdminActiveTab(undefined);
          }
          setCurrentTab(tab);
        }}
        guidesCount={guides.length}
        siteName={settings.siteName}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        totalUsersCount={allUsers.length}
        navMenus={settings.navMenus}
        accessMode={settings.accessMode}
        onToggleAccessMode={handleToggleAccessMode}
        requireLoginForCMS={settings.requireLoginForCMS}
        onOpenMenuEditor={() => setIsMenuEditorOpen(true)}
        onOpenSiteEditor={() => setIsSiteEditorOpen(true)}
        logoInitial={settings.logoInitial}
        logoIcon={settings.logoIcon}
        brandBadge={settings.brandBadge}
        brandBadgeColor={settings.brandBadgeColor}
        tagline={settings.tagline}
        onSelectAdminTab={(tab) => {
          setAdminActiveTab(tab as any);
          setCurrentTab('admin');
        }}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {currentTab === 'public' && (
          <PublicView
            guides={guides}
            categories={categories}
            settings={settings}
            onEditGuide={handleEditGuideFromPublic}
            onOpenCMS={() => {
              setInitialEditingGuide(null);
              setAdminActiveTab(undefined);
              setCurrentTab('admin');
            }}
            currentUser={currentUser}
            onToggleSaveGuide={handleToggleSaveGuide}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onRecordActivity={(action, details) => handleAddActivityLog(action, details)}
            onOpenSiteEditor={() => setIsSiteEditorOpen(true)}
          />
        )}

        {currentTab === 'admin' && (
          <AdminCMS
            guides={guides}
            categories={categories}
            settings={settings}
            onSaveGuides={setGuides}
            onSaveCategories={setCategories}
            onSaveSettings={setSettings}
            onResetDefault={handleResetDefault}
            initialEditingGuide={initialEditingGuide}
            onClearInitialEdit={() => setInitialEditingGuide(null)}
            onSwitchToPublic={() => setCurrentTab('public')}
            allUsers={allUsers}
            onSaveUsers={setAllUsers}
            activityLogs={activityLogs}
            onAddLog={handleAddActivityLog}
            currentUser={currentUser}
            initialActiveTab={adminActiveTab}
            onOpenSiteEditor={() => setIsSiteEditorOpen(true)}
          />
        )}

        {currentTab === 'guide' && (
          <ManagementGuide
            onOpenCMS={() => {
              setInitialEditingGuide(null);
              setAdminActiveTab(undefined);
              setCurrentTab('admin');
            }}
            onOpenPublic={() => setCurrentTab('public')}
          />
        )}
      </main>

      {/* Login & Register Email Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        allUsers={allUsers}
        onLoginSuccess={handleLoginSuccess}
        onAddLog={handleAddActivityLog}
      />

      {/* Pro Menu Editor Modal (Gaya Web Berbayar) */}
      <MenuEditorModal
        isOpen={isMenuEditorOpen}
        onClose={() => setIsMenuEditorOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        onRecordActivity={handleAddActivityLog}
      />

      {/* Site Identity & Info Editor Modal */}
      <SiteIdentityEditorModal
        isOpen={isSiteEditorOpen}
        onClose={() => setIsSiteEditorOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        onRecordActivity={handleAddActivityLog}
      />

    </div>
  );
}
