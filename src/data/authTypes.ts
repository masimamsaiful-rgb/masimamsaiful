export type UserRole = 'admin' | 'technician' | 'member';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  deviceInterest?: string;
  createdAt: string;
  lastLoginAt: string;
  savedGuideIds?: string[];
  notes?: string;
  status: 'active' | 'suspended';
}

export interface UserActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  action: 'login' | 'register' | 'view_guide' | 'save_guide' | 'consult_wa' | 'create_guide' | 'edit_guide' | 'logout' | 'menu_change' | 'access_mode_change';
  details: string;
  timestamp: string;
}

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'u-admin-1',
    email: 'masimamsaiful@gmail.com',
    name: 'Mas Imam Saiful (Super Admin)',
    phone: '081234567890',
    role: 'admin',
    deviceInterest: 'Semua Perangkat',
    createdAt: '2026-10-10 09:00:00',
    lastLoginAt: '2026-10-14 10:48:00',
    savedGuideIds: ['g-laptop-1', 'g-printer-2'],
    notes: 'Pemilik utama & Teknisi Kepala Meja Servis',
    status: 'active'
  },
  {
    id: 'u-tech-1',
    email: 'budi.teknisi@mejaservis.id',
    name: 'Budi Santoso',
    phone: '081398765432',
    role: 'technician',
    deviceInterest: 'Laptop & Hardware',
    createdAt: '2026-10-11 11:20:00',
    lastLoginAt: '2026-10-13 16:30:00',
    savedGuideIds: ['g-laptop-2'],
    notes: 'Spesialis perbaikan motherboard dan laptop overheat',
    status: 'active'
  },
  {
    id: 'u-user-1',
    email: 'dian.lestari@gmail.com',
    name: 'Dian Lestari',
    phone: '085712348899',
    role: 'member',
    deviceInterest: 'Printer Kantor',
    createdAt: '2026-10-12 14:15:00',
    lastLoginAt: '2026-10-14 08:12:00',
    savedGuideIds: ['g-printer-1', 'g-printer-2'],
    notes: 'Pelanggan kantor, sering mengalami printer macet',
    status: 'active'
  },
  {
    id: 'u-user-2',
    email: 'reza.aditya@yahoo.com',
    name: 'Reza Aditya Pratama',
    phone: '082199887766',
    role: 'member',
    deviceInterest: 'Jaringan & Wi-Fi',
    createdAt: '2026-10-13 17:45:00',
    lastLoginAt: '2026-10-14 09:20:00',
    savedGuideIds: ['g-jaringan-1'],
    notes: 'Member komunitas jaringan',
    status: 'active'
  }
];

export const INITIAL_ACTIVITY_LOGS: UserActivityLog[] = [
  {
    id: 'log-1',
    userId: 'u-admin-1',
    userEmail: 'masimamsaiful@gmail.com',
    userName: 'Mas Imam Saiful (Super Admin)',
    action: 'login',
    details: 'Berhasil login ke Dashboard Admin',
    timestamp: '2026-10-14 10:48:00'
  },
  {
    id: 'log-2',
    userId: 'u-user-1',
    userEmail: 'dian.lestari@gmail.com',
    userName: 'Dian Lestari',
    action: 'view_guide',
    details: 'Membaca solusi "Kertas macet (paper jam)"',
    timestamp: '2026-10-14 08:12:30'
  },
  {
    id: 'log-3',
    userId: 'u-user-2',
    userEmail: 'reza.aditya@yahoo.com',
    userName: 'Reza Aditya Pratama',
    action: 'consult_wa',
    details: 'Klik tombol konsultasi WhatsApp masalah Wi-Fi',
    timestamp: '2026-10-14 09:20:15'
  }
];
