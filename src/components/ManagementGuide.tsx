import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  FileSpreadsheet, 
  Globe, 
  Database, 
  HelpCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  TrendingUp, 
  ShoppingBag, 
  MessageSquare, 
  ShieldCheck,
  Lightbulb,
  ExternalLink
} from 'lucide-react';

interface ManagementGuideProps {
  onOpenCMS: () => void;
  onOpenPublic: () => void;
}

export const ManagementGuide: React.FC<ManagementGuideProps> = ({
  onOpenCMS,
  onOpenPublic,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const sampleGoogleSheetFormula = `// Contoh script Google Apps Script untuk jadikan Google Sheets jadi API JSON gratis:
function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    rows.push(obj);
  }
  return ContentService.createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(sampleGoogleSheetFormula);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Buku Panduan Pemilik Web</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white mb-3">
            Cara Termudah Mengelola Website "Meja Servis"
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Di kode bawaan aslinya, semua artikel tertulis di dalam kode JavaScript (<code className="text-amber-300 font-mono text-xs">const D = [...]</code>). Berikut adalah panduan pilihan cara termudah mengelolanya dari yang <strong>paling instan tanpa sentuh koding</strong> hingga cara otomatis untuk jangka panjang.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCMS}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Coba Panel CMS Bawaan Sekarang</span>
            </button>
            <button
              onClick={onOpenPublic}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl transition-colors border border-slate-700"
            >
              Lihat Tampilan Web Pengunjung
            </button>
          </div>
        </div>
      </div>

      {/* 4 Methods Comparison */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-1">
            4 Pilihan Cara Mengelola Konten Web
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pilihlah metode yang paling sesuai dengan kebiasaan dan keahlian teknis Anda:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Option 1: CMS Dashboard (Easiest) */}
          <div className="bg-white border-2 border-amber-500/60 rounded-2xl p-6 shadow-sm relative space-y-4">
            <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Paling Direkomendasikan
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">
                Gunakan Panel Admin CMS Bawaan Ini
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Telah kami pasangkan langsung di dalam web ini! Anda cukup klik tombol <strong>"Panel Pengelola (CMS)"</strong> di navigasi atas.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>100% Visual</strong>: Tambah, edit, dan hapus panduan lewat formulir interaktif.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Input Kolektif Excel (.XLS / .XLSX)</strong>: Ketik puluhan panduan sekaligus di Excel atau WPS Office dan upload sekali klik!</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Template 1 Klik</strong>: Tersedia template masalah umum (BSOD, Blinking, Wi-Fi).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Backup & Restore</strong>: Bisa download backup JSON atau ekspor ke file Excel (.xlsx).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Tersimpan Otomatis</strong>: Menggunakan LocalStorage browser sehingga aman saat refresh.</span>
              </li>
            </ul>
            <button
              onClick={onOpenCMS}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Buka Menu CMS Ini</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Option 2: Google Sheets as No-Code Database */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">
                Google Sheets sebagai Database Gratis
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sangat cocok jika toko servis Anda memiliki beberapa teknisi yang ingin menginput solusi dari HP melalui aplikasi Google Sheets.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Buat spreadsheet dengan kolom: <code className="bg-slate-100 px-1 rounded">Kategori</code>, <code className="bg-slate-100 px-1 rounded">Judul</code>, <code className="bg-slate-100 px-1 rounded">Gejala</code>, <code className="bg-slate-100 px-1 rounded">Solusi</code>, <code className="bg-slate-100 px-1 rounded">Alat</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Gunakan layanan seperti <strong>SheetDB.io</strong> atau Google Apps Script (lihat script di bawah).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Setiap teknisi mengedit baris di Google Sheets, website langsung update secara otomatis tanpa deploy ulang!</span>
              </li>
            </ul>
          </div>

          {/* Option 3: File JSON / Git Static Hosting */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">
                Ekspor File JSON ke GitHub / Vercel
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cocok jika Anda ingin hosting 100% gratis di GitHub Pages, Vercel, atau Cloudflare Pages dengan performa loading super cepat.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Gunakan tombol <strong>"Salin Data JSON"</strong> di tab Backup panel admin CMS kami.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Tempelkan data tersebut ke file <code className="bg-slate-100 px-1 rounded">src/data/defaultGuides.ts</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Kirim (push) ke GitHub, website Anda langsung terupdate otomatis.</span>
              </li>
            </ul>
          </div>

          {/* Option 4: Headless CMS (Strapi / Supabase) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">
                Headless CMS / Backend Cloud
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gunakan jika di masa depan Anda ingin membuat portal servis skala besar dengan sistem login teknisi, order booking tracking, dan komentar pembaca.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Pilihan terbaik: <strong>Supabase</strong> (Database PostgreSQL gratis) atau <strong>Directus / Strapi</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Tersedia hak akses multi-user (Admin, Editor Teknisi, Kasir).</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Monetization & Strategy Guide */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Strategi Bisnis & Cuan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Cara Menghasilkan Uang dari Web Panduan Servis Ini
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Website panduan teknisi memiliki nilai konversi tinggi karena orang yang mencari artikel adalah mereka yang sedang butuh alat atau jasa servis segera!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-bold text-sm text-slate-900">
              1. Komisi Afiliasi Alat
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Daftar ke <strong>Shopee Affiliate</strong> atau <strong>Tokopedia Affiliate</strong>. Pada setiap panduan di CMS, isi tautan alat bantu dengan link afiliasi Anda (misal: thermal paste, kabel USB printer, obeng presisi). Saat pembaca membeli, Anda dapat komisi 5-10%!
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-bold text-sm text-slate-900">
              2. Jasa Servis via WhatsApp
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Banyak orang membaca panduan namun takut membongkar sendiri (misal kasus motherboard atau ganti fleksibel). Di CMS sudah disediakan tombol <strong>"Tanya Teknisi"</strong> yang langsung menuju WhatsApp Anda dengan pesan terisi otomatis sesuai kerusakan!
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-bold text-sm text-slate-900">
              3. Google AdSense
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Setelah menambahkan 20 sampai 30 panduan perbaikan yang bermanfaat dan unik, daftarkan website ke Google AdSense. Aktifkan saklar slot iklan di menu Pengaturan CMS untuk mulai menghasilkan uang dari tayangan iklan.
            </p>
          </div>
        </div>
      </section>

      {/* Bonus Code snippet for Google Apps Script */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Script Google Sheets API (Untuk yang Ingin Pakai Spreadsheet Gratis)</span>
          </div>
          <button
            onClick={handleCopyScript}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Tersalin!' : 'Salin Script'}</span>
          </button>
        </div>
        <pre className="text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto leading-relaxed">
          {sampleGoogleSheetFormula}
        </pre>
        <p className="text-[11px] text-slate-400">
          Cukup tempel di <em>Extensions &gt; Apps Script</em> di Google Sheets Anda, lalu klik <em>Deploy as Web App</em>.
        </p>
      </section>

    </div>
  );
};
