export interface GuideItem {
  id: string;
  c: string; // Kategori: Laptop, Printer, Jaringan, dll.
  t: string; // Judul masalah
  g: string; // Gejala
  p: string[]; // Kemungkinan penyebab
  s: string[]; // Langkah perbaikan
  k: string; // Kapan perlu ke teknisi
  a: string; // Alat yang membantu
  afUrl?: string; // Link beli alat / afiliasi
  imageUrl?: string; // URL / ilustrasi foto
  updatedAt?: string;
}

export interface NavMenuItem {
  id: string;
  label: string;
  target: 'public' | 'admin' | 'guide' | 'custom_url' | 'whatsapp' | 'users';
  url?: string;
  visible: boolean;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  icon?: string;
  badge?: string;
  badgeColor?: 'amber' | 'emerald' | 'rose' | 'purple' | 'blue' | 'slate';
  openInNewTab?: boolean;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  subtitle: string;
  logoInitial?: string;
  logoIcon?: string;
  brandBadge?: string;
  brandBadgeColor?: 'amber' | 'emerald' | 'rose' | 'purple' | 'blue' | 'slate';
  // Announcement Banner
  showAnnouncement?: boolean;
  announcementText?: string;
  announcementLink?: string;
  announcementColor?: 'amber' | 'emerald' | 'blue' | 'purple';
  // Contact & Support
  whatsappNumber: string;
  whatsappMessage: string;
  contactEmail?: string;
  operatingHours?: string;
  // Ads & Disclaimer
  enableAds: boolean;
  adText: string;
  footerDisclaimer: string;
  footerCopyright?: string;
  // Access Policy: 'free' (langsung masuk) vs 'gated' (perlu login email)
  accessMode: 'free' | 'gated';
  requireLoginForCMS: boolean;
  gatedMessage: string;
  // Dashboard & Navigation Menu Editor
  navMenus: NavMenuItem[];
}

export const INITIAL_GUIDES: GuideItem[] = [
  {
    id: "g-laptop-1",
    c: "Laptop",
    t: "Laptop mati total, tidak ada lampu indikator",
    g: "Ditekan tombol power tidak ada reaksi, lampu indikator padam, kipas diam.",
    p: [
      "Adaptor atau konektor charger rusak",
      "Baterai drop atau muatan statis tersisa di motherboard",
      "RAM kendor atau kotor kontak pin-nya",
      "Kerusakan IC power / short circuit motherboard"
    ],
    s: [
      "Coba adaptor lain yang voltase & amperenya sama. Cek lampu di charger jika ada.",
      "Cabut adaptor dan baterai (jika bisa dilepas), tahan tombol power 30 detik untuk buang sisa muatan statis, pasang adaptor saja lalu coba nyalakan.",
      "Lepas RAM, bersihkan kontak emasnya dengan penghapus pensil halus atau alkohol isopropil, pasang kembali sampai klik kencang.",
      "Periksa colokan DC di laptop: goyang pelan jack adaptor, jika lampu sempat hidup-mati berarti jack DC longgar/patah solderannya."
    ],
    k: "Jika semua langkah gagal, atau tercium bau gosong/bekas cairan, segera berhenti mencoba dan serahkan ke teknisi elektronika profesional.",
    a: "Multitester Digital & Set Obeng Presisi Teknisi",
    afUrl: "https://shopee.co.id/search?keyword=obeng+presisi+laptop",
    updatedAt: "2026-10-14"
  },
  {
    id: "g-laptop-2",
    c: "Laptop",
    t: "Laptop panas dan kipas berisik meraung",
    g: "Bodi terasa panas menyengat, kipas meraung kencang, laptop sering mati sendiri (thermal throttling) saat dipakai berat.",
    p: [
      "Debu tebal menyumbat ventilasi sirip heatsink",
      "Thermal paste processor sudah kering dan keras",
      "Laptop sering dipakai di atas kasur/bantal yang menutup sirkulasi udara bawah"
    ],
    s: [
      "Pasang aplikasi HWMonitor atau HWiNFO untuk cek suhu CPU. Jika di atas 85-90°C saat idle/beban ringan, pendingin bermasalah.",
      "Matikan laptop, buka cover bawah, bersihkan kipas dan sirip tembaga heatsink dengan kuas lembut & mini blower.",
      "Ganti thermal paste jika laptop sudah berumur lebih dari 1.5 - 2 tahun dengan pasta berkualitas.",
      "Gunakan selalu alas keras datar atau cooling pad berventilasi baik saat bekerja lama."
    ],
    k: "Jika ragu membuka rangka laptop atau suhu tetap di atas 95°C setelah dibersihkan, bawa ke teknisi untuk repasting profesional.",
    a: "Thermal Paste Berkualitas (Arctic MX-4 / Thermal Grizzly) & Kuas Anti-Statis",
    afUrl: "https://shopee.co.id/search?keyword=thermal+paste+arctic+mx4",
    updatedAt: "2026-10-14"
  },
  {
    id: "g-laptop-3",
    c: "Laptop",
    t: "Laptop lemot, loading lama, dan sering hang",
    g: "Booting lebih dari 2 menit, aplikasi lama terbuka, kursor tersendat-sendat saat multitasking.",
    p: [
      "Masih memakai Hard Disk (HDD) mekanik lama yang performanya lambat atau bad sector",
      "Kapasitas RAM kurang untuk kebutuhan sistem operasi modern",
      "Terlalu banyak program startup berjalan di latar belakang",
      "Infeksi malware atau file sampah temp menumpuk"
    ],
    s: [
      "Buka Task Manager (Ctrl + Shift + Esc), periksa tab Performance apakah Disk atau Memory mentok 100%.",
      "Nonaktifkan aplikasi startup yang tidak wajib di tab Startup Apps.",
      "Pastikan sisa ruang kosong di partisi C minimal 15-20% untuk virtual memory Windows.",
      "Jika laptop masih memakai HDD konvensional, upgrade ke SSD SATA atau NVMe — ini solusi paling cepat dan terasa seperti laptop baru.",
      "Jalankan pemindaian penuh dengan Windows Security."
    ],
    k: "Jika disk konstan 100% disertai bunyi 'klik-klik' berulang dari bagian dalam laptop, segera selamatkan data penting Anda.",
    a: "SSD SATA 2.5 inch atau NVMe PCIe M.2",
    afUrl: "https://shopee.co.id/search?keyword=ssd+sata+512gb",
    updatedAt: "2026-10-14"
  },
  {
    id: "g-laptop-4",
    c: "Laptop",
    t: "Wi-Fi laptop tidak terdeteksi atau sering silang merah",
    g: "Ikon Wi-Fi hilang, hanya muncul logo globe/dunia silang, atau tertulis 'No Wi-Fi networks found'.",
    p: [
      "Mode pesawat aktif atau tombol pintasan Fn Wi-Fi tidak sengaja tertekan",
      "Driver Wi-Fi WLAN korup setelah update Windows",
      "Modul Wi-Fi card mini-PCIe / M.2 kendor atau rusak"
    ],
    s: [
      "Pastikan Mode Pesawat (Airplane Mode) dalam keadaan OFF dan coba tombol Fn + ikon antena.",
      "Buka Device Manager > Network adapters. Cari kartu Wi-Fi. Jika ada ikon tanda seru kuning, klik kanan > Update driver atau Uninstall lalu restart laptop.",
      "Buka Command Prompt (Run as Administrator), ketik: netsh winsock reset tekan Enter, lalu netsh int ip reset tekan Enter, kemudian restart.",
      "Uji dengan menyalakan Hotspot dari smartphone dalam jarak 1 meter untuk memastikan apakah masalah pada laptop atau router."
    ],
    k: "Jika adapter Wi-Fi sama sekali tidak terdaftar di Device Manager meski sudah scan hardware, modul WLAN fisik mungkin longgar atau perlu diganti.",
    a: "USB Wi-Fi Dongle Adapter Mini (solusi instan tanpa bongkar)",
    afUrl: "https://shopee.co.id/search?keyword=usb+wifi+adapter+tp-link",
    updatedAt: "2026-10-14"
  },
  {
    id: "g-printer-1",
    c: "Printer",
    t: "Kertas macet (paper jam) dan lampu berkedip oranye",
    g: "Printer tiba-tiba berhenti saat mencetak, lampu error berkedip, lembaran kertas tertahan miring di dalam mekanisme penarik.",
    p: [
      "Kertas lembap, kusut, atau melengkung",
      "Roller penarik kertas berdebu atau karetnya mulai licin aus",
      "Ada serpihan sobekan kertas, klip kertas, atau kotoran asing masuk ke tray"
    ],
    s: [
      "Matikan printer, cabut kabel power, tarik kertas pelan-pelan dengan kedua tangan searah alur jalannya kertas (jangan ditarik paksa melawan arah).",
      "Buka penutup depan/belakang, gunakan senter untuk memeriksa sisa serpihan kertas kecil di dekat carriage cartridge.",
      "Bersihkan karet pickup roller dengan kain halus yang dibasahi sedikit air hangat atau alkohol pembersih.",
      "Simpan tumpukan kertas di tempat kering dan kibaskan kertas sebelum dimasukkan ke paper tray."
    ],
    k: "Jika printer menarik beberapa lembar kertas sekaligus atau terdengar bunyi gigi roda gerigi berderak keras, roller ASF perlu diservis/ganti.",
    a: "Cairan Pembersih Karet Roller & Kain Microfiber",
    afUrl: "https://shopee.co.id/search?keyword=roller+cleaner+printer",
    updatedAt: "2026-10-14"
  },
  {
    id: "g-printer-2",
    c: "Printer",
    t: "Hasil cetak bergaris putih atau warna pudar putus-putus",
    g: "Dokumen yang dicetak memiliki garis putih horizontal melintang, teks kabur, atau salah satu warna tidak keluar sama sekali.",
    p: [
      "Nozzle head printer tersumbat oleh sisa tinta yang mengering",
      "Level tinta dalam tabung atau cartridge sudah menipis",
      "Printer lama tidak dinyalakan (lebih dari 2 minggu)"
    ],
    s: [
      "Buka Preferences printer di komputer, cetak lembar uji 'Nozzle Check' untuk mendeteksi warna mana yang putus.",
      "Jalankan fitur 'Head Cleaning' dari menu Maintenance driver. Lakukan maksimal 2-3 kali, lalu diamkan 1 jam agar busa tinta rileks.",
      "Pastikan tangki tinta terisi minimal di atas garis bawah dan kran infus dalam posisi terbuka.",
      "Cetak rutin minimal 1 halaman teks warna-warni setiap 3-5 hari sekali untuk mencegah tinta mengering di lubang nozzle."
    ],
    k: "Jika head cleaning berulang tetap menghasilkan garis yang sama, print head mungkin mengalami clogging parah atau rusak permanen.",
    a: "Tinta Botol Original Pabrikan & Head Cleaner Solution",
    afUrl: "https://shopee.co.id/search?keyword=cairan+head+cleaner+printer",
    updatedAt: "2026-10-14"
  },
  {
    id: "g-printer-3",
    c: "Printer",
    t: "Printer tidak terdeteksi (Status Offline) di Windows",
    g: "Printer menyala normal, kabel terhubung, tetapi dokumen tertahan di queue antrean cetak dengan status 'Offline'.",
    p: [
      "Kabel data USB longgar atau port USB laptop bermasalah",
      "Layanan sistem Windows 'Print Spooler' mengalami crash/macet",
      "Driver printer korup atau ada duplikat driver printer di sistem"
    ],
    s: [
      "Pindahkan kabel USB ke port USB yang berbeda langsung di bodi laptop (hindari memakai USB hub tanpa daya tambahan).",
      "Buka tombol Windows + R, ketik 'services.msc', cari layanan 'Print Spooler', klik kanan lalu pilih 'Restart'.",
      "Buka folder 'C:\\Windows\\System32\\spool\\PRINTERS' dan hapus semua file sementara yang tertahan di sana.",
      "Hapus printer dari menu Settings > Bluetooth & Devices > Printers, lalu download dan instal driver original terbaru dari situs resmi merk printer Anda."
    ],
    k: "Jika diuji di 2 komputer berbeda tetap tidak terdeteksi di Device Manager, kemungkinan port USB board printer rusak atau korslet.",
    a: "Kabel USB Printer Type A to Type B Berkualitas (Gold Plated)",
    afUrl: "https://shopee.co.id/search?keyword=kabel+printer+usb+ugreen",
    updatedAt: "2026-10-14"
  },
  {
    id: "g-jaringan-1",
    c: "Jaringan",
    t: "Koneksi Wi-Fi sering putus-putus dan ping loncat tinggi",
    g: "Internet tiba-tiba hilang lalu nyambung lagi, video streaming sering buffering, meeting online putus suara.",
    p: [
      "Kepadatan frekuensi channel Wi-Fi (interferensi sinyal dengan tetangga)",
      "Router terlalu panas karena ditaruh di ruang tertutup tanpa ventilasi",
      "Jarak terlalu jauh atau terhalang dinding cor tebal"
    ],
    s: [
      "Restart router modem dengan mematikan saklar selama 30 detik lalu nyalakan kembali.",
      "Akses halaman admin router (192.168.1.1 atau 192.168.0.1), ubah channel Wi-Fi frekuensi 2.4 GHz ke channel bersih: 1, 6, atau 11.",
      "Letakkan router di posisi yang tinggi (minimal 1.5 meter dari lantai) dan di tempat terbuka, jauhkan dari microwave atau benda logam besar.",
      "Gunakan frekuensi 5 GHz jika laptop dan router sudah mendukung untuk kecepatan maksimal dan bebas interferensi.",
      "Ganti pengaturan DNS di laptop atau router ke DNS cepat: 1.1.1.1 (Cloudflare) atau 8.8.8.8 (Google)."
    ],
    k: "Jika seluruh lampu indikator LOS di modem berkedip merah bersamaan, segera hubungi call center provider ISP Anda karena kabel fiber optik luar mungkin terputus.",
    a: "Kabel LAN Cat6 Gigabit atau Wi-Fi Extender / Mesh Router",
    afUrl: "https://shopee.co.id/search?keyword=kabel+lan+cat6+gigabit",
    updatedAt: "2026-10-14"
  }
];

export const TEMPLATES_QUICK_ADD = [
  {
    c: "Laptop",
    t: "Layar Laptop Blue Screen of Death (BSOD)",
    g: "Layar tiba-tiba membiru dengan teks error 'Your PC ran into a problem', lalu laptop restart sendiri berulang kali.",
    p: [
      "Driver grafis atau chipset yang tidak cocok setelah update",
      "Sektor memori RAM yang korup",
      "Kerusakan file sistem Windows (system file corrupted)"
    ],
    s: [
      "Catat kode error yang muncul (misal: MEMORY_MANAGEMENT, CRITICAL_PROCESS_DIED).",
      "Masuk ke Windows Safe Mode, lalu uninstall update driver terbaru yang baru saja dipasang.",
      "Buka Command Prompt Run as Administrator, jalankan perintah: sfc /scannow lalu enter untuk perbaikan otomatis file Windows.",
      "Jalankan Windows Memory Diagnostic tool untuk memeriksa kerusakan fisik keping RAM."
    ],
    k: "Jika BSOD terjadi setiap beberapa menit sekali bahkan saat baru masuk BIOS/instal ulang, modul RAM atau motherboard bermasalah fisik.",
    a: "USB Flashdisk Bootable Windows & Obeng Pembuka Casing"
  },
  {
    c: "Printer",
    t: "Lampu Printer Blinking Bergantian (Ink Pad / Absorber Penuh)",
    g: "Lampu power dan lampu indikator tinta berkedip bergantian secara cepat, muncul pesan 'A printer's ink pad is at the end of its service life'.",
    p: [
      "Spons penampung sisa pembuangan tinta di dalam printer sudah penuh menurut hitungan counter firmware",
      "Sistem proteksi printer otomatis mengunci mesin agar cairan tinta tidak meluap keluar ke meja"
    ],
    s: [
      "Gunakan software resetter resmi atau aplikasi utility reset counter khusus untuk tipe printer Anda.",
      "Buka panel penampungan busa pembuangan di bagian belakang bawah printer.",
      "Cuci dan keringkan spons penyerap tinta, atau ganti dengan busa pembuangan baru.",
      "Pertimbangkan memasang botol tabung pembuangan tinta eksternal agar mudah dipantau dan dibuang."
    ],
    k: "Jika tidak memiliki kabel dan software resetter yang cocok, minta bantuan teknisi printer terdekat untuk reset counter chip.",
    a: "Busa Waste Ink Pad Pengganti & Selang Pembuangan Eksternal"
  },
  {
    c: "Jaringan",
    t: "Status Wi-Fi 'Connected, No Internet' di Windows",
    g: "Laptop terhubung ke nama Wi-Fi rumah, tetapi muncul peringatan tanda seru 'Connected, no internet access' dan website tidak bisa dibuka.",
    p: [
      "Alokasi IP Address lokal mengalami konflik DHCP",
      "DNS cache di komputer bermasalah atau router belum terautentikasi ke ISP",
      "Akun langganan internet sedang isolir atau proses pembayaran tertunda"
    ],
    s: [
      "Coba buka website di HP yang terhubung ke Wi-Fi yang sama untuk memastikan apakah internet rumah aktif.",
      "Buka Command Prompt sebagai Admin, jalankan: ipconfig /flushdns lalu ipconfig /release dan ipconfig /renew.",
      "Nonaktifkan sementara VPN atau Proxy yang sedang aktif di browser/laptop.",
      "Restart modem router ISP selama 1 menit lalu sambungkan kembali."
    ],
    k: "Jika lampu Internet pada modem router tidak menyala hijau, kemungkinan server ISP sedang mengalami gangguan massal di area Anda.",
    a: "Kabel Patchcord Fiber Optik SC-UPC Pengganti"
  }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "Meja Servis",
  tagline: "Solusi dari teknisi, bukan sekadar teori",
  subtitle: "Koleksi panduan perbaikan laptop, printer, dan jaringan komputer teruji langsung di meja servis. Dilengkapi dengan panel kelola konten (CMS) termudah.",
  logoInitial: "M",
  logoIcon: "Wrench",
  brandBadge: "PRO",
  brandBadgeColor: "amber",
  showAnnouncement: true,
  announcementText: "⚡ Layanan Konsultasi Cepat Teknisi Aktif: Tanya jawab diagnosa kerusakan laptop & printer via WhatsApp!",
  announcementLink: "",
  announcementColor: "amber",
  whatsappNumber: "6281234567890",
  whatsappMessage: "Halo Meja Servis, saya mau konsultasi masalah kerusakan perangkat saya: ",
  contactEmail: "support@mejaservis.id",
  operatingHours: "Senin - Sabtu: 08.30 - 21.00 WIB",
  enableAds: true,
  adText: "Slot Iklan Google AdSense (Responsif Display 728x90 / 300x250)",
  footerDisclaimer: "Ikuti langkah dengan hati-hati. Jika ragu membongkar perangkat, selalu bawa ke teknisi terdekat. Tautan produk dapat berupa tautan afiliasi yang mendukung kelangsungan situs ini.",
  footerCopyright: "Semua hak cipta dilindungi.",
  accessMode: 'free',
  requireLoginForCMS: false,
  gatedMessage: "Langkah-langkah perbaikan lengkap ini hanya dapat dibaca setelah memasukkan email Anda (Gratis tanpa biaya).",
  navMenus: [
    { id: 'menu-public', label: 'Tampilan Web', target: 'public', visible: true, icon: 'Eye' },
    { id: 'menu-admin', label: 'Panel CMS', target: 'admin', visible: true, requiresAuth: false, icon: 'LayoutDashboard', badge: 'PRO', badgeColor: 'amber' },
    { id: 'menu-guide', label: 'Panduan Pengelolaan', target: 'guide', visible: true, icon: 'BookOpen' },
  ]
};
