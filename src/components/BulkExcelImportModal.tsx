import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Check, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { GuideItem } from '../data/defaultGuides';

interface BulkExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onImportSuccess: (importedGuides: GuideItem[], mode: 'append' | 'replace', newCategories: string[]) => void;
}

export const BulkExcelImportModal: React.FC<BulkExcelImportModalProps> = ({
  isOpen,
  onClose,
  categories,
  onImportSuccess,
}) => {
  const [parsedGuides, setParsedGuides] = useState<GuideItem[]>([]);
  const [detectedCategories, setDetectedCategories] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');

  if (!isOpen) return null;

  // Download template Excel file
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Kategori': 'Laptop',
        'Judul_Masalah': 'Layar Laptop Bergaris atau Berkedip (Flicker)',
        'Gejala': 'Layar berkedip saat engsel dibuka-tutup, muncul garis horizontal tipis warna-warni.',
        'Kemungkinan_Penyebab': 'Kabel fleksibel LCD terjepit atau longgar; Panel layar LCD rusak fisik; Driver grafis VGA korup',
        'Langkah_Perbaikan': 'Hubungkan laptop ke monitor eksternal via kabel HDMI untuk memastikan VGA normal; Buka bezel frame layar dan periksa soket kabel fleksibel; Bersihkan pin konektor dengan cairan contact cleaner; Ganti kabel fleksibel jika terlihat robek atau terjepit.',
        'Kapan_Ke_Teknisi': 'Jika di monitor eksternal juga muncul garis, kerusakan ada pada chip GPU/motherboard yang butuh reballing.',
        'Alat_Rekomendasi': 'Set obeng pembuka casing, kabel fleksibel LCD cadangan, obeng plus mini',
        'Link_Afiliasi': 'https://shopee.co.id/search?keyword=kabel+fleksibel+laptop'
      },
      {
        'Kategori': 'Printer',
        'Judul_Masalah': 'Printer Menarik Kertas Banyak Sekaligus (Multiple Feed)',
        'Gejala': 'Sekali print, 3 sampai 5 lembar kertas tertarik bersamaan lalu tersangkut di dalam rol penarik.',
        'Kemungkinan_Penyebab': 'Bantalan karet separator pad aus atau sobek; Kertas terlalu tipis atau lembap; Per penahan roller lepas',
        'Langkah_Perbaikan': 'Kibaskan kertas sebelum dimasukkan ke paper tray agar tidak saling menempel; Gunakan kertas dengan ketebalan minimal 70 atau 80 gsm; Periksa karet separator pad di bawah rol penarik; Ganti separator pad dengan yang baru jika karetnya sudah tipis licin.',
        'Kapan_Ke_Teknisi': 'Jika mekanik gigi gear di samping roller patah atau berbunyi derak keras saat berputar.',
        'Alat_Rekomendasi': 'Karet separator pad printer & cairan pembersih roller karet',
        'Link_Afiliasi': 'https://shopee.co.id/search?keyword=separator+pad+printer'
      },
      {
        'Kategori': 'Jaringan',
        'Judul_Masalah': 'Port LAN Ethernet Laptop Tidak Menyala Lampunya',
        'Gejala': 'Kabel LAN dicolokkan ke laptop tetapi lampu indikator di samping port RJ45 padam total dan Windows mendeteksi "Cable Unplugged".',
        'Kemungkinan_Penyebab': 'Konektor pin emas kabel LAN RJ45 kotor atau patah salah satu jarumnya; Driver Realtek PCIe Ethernet dinonaktifkan; Port LAN terbakar imbas petir',
        'Langkah_Perbaikan': 'Coba kabel LAN lain yang sudah dipastikan normal di komputer lain; Bersihkan lubang port RJ45 laptop dengan kuas kering halus; Buka Device Manager pastikan Ethernet Controller aktif; Jalankan network adapter troubleshooter bawaan Windows.',
        'Kapan_Ke_Teknisi': 'Jika IC LAN Ethernet di motherboard laptop terbakar karena lonjakan arus petir, butuh penggantian chip.',
        'Alat_Rekomendasi': 'USB to Gigabit Ethernet LAN Adapter (solusi cepat)',
        'Link_Afiliasi': 'https://shopee.co.id/search?keyword=usb+to+lan+gigabit'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 }, // Kategori
      { wch: 35 }, // Judul
      { wch: 45 }, // Gejala
      { wch: 45 }, // Penyebab
      { wch: 55 }, // Langkah
      { wch: 40 }, // Teknisi
      { wch: 30 }, // Alat
      { wch: 30 }, // Afiliasi
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Panduan_Servis');

    XLSX.writeFile(workbook, 'Template_Panduan_Meja_Servis.xlsx');
  };

  // Parse uploaded Excel / CSV file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          setErrorMsg('File Excel tidak memiliki lembar kerja (worksheet).');
          return;
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (rawJson.length === 0) {
          setErrorMsg('File Excel kosong atau tidak memiliki baris data.');
          return;
        }

        // Map flexible headers
        const parsed: GuideItem[] = [];
        const detectedCatsSet = new Set<string>();

        rawJson.forEach((row, index) => {
          // Normalize keys
          const keys = Object.keys(row);
          const findVal = (possibleNames: string[]) => {
            const foundKey = keys.find(k => 
              possibleNames.some(pn => k.toLowerCase().replace(/[^a-z0-9]/g, '') === pn.toLowerCase().replace(/[^a-z0-9]/g, ''))
            );
            return foundKey ? String(row[foundKey]).trim() : '';
          };

          const kategori = findVal(['kategori', 'category', 'kat', 'jenis', 'perangkat']) || 'Laptop';
          const judul = findVal(['judulmasalah', 'judul', 'title', 'masalah', 'problem', 'namamasalah']);
          const gejala = findVal(['gejala', 'symptom', 'symptoms', 'deskripsi', 'indikasi']) || 'Gejala belum dijelaskan.';
          const rawPenyebab = findVal(['kemungkinanpenyebab', 'penyebab', 'causes', 'cause', 'faktor']);
          const rawLangkah = findVal(['langkahperbaikan', 'langkah', 'solusi', 'steps', 'cara', 'perbaikan', 'penanganan']);
          const kapanTeknisi = findVal(['kapanketeknisi', 'teknisi', 'peringatan', 'bahaya', 'danger', 'warning']) || 'Bawa ke teknisi jika langkah di atas tidak membuahkan hasil.';
          const alat = findVal(['alatrekomendasi', 'alat', 'tools', 'tool', 'alatyangmembantu']) || 'Set obeng & alat tes';
          const linkAfiliasi = findVal(['linkafiliasi', 'afiliasi', 'link', 'url', 'shopee', 'tokopedia']) || '';

          // Only process rows that have at least a title
          if (!judul) return;

          // Helper to split multi-line or semicolon lists
          const splitList = (text: string): string[] => {
            if (!text) return [];
            // If contains semicolon, split by ;
            if (text.includes(';')) {
              return text.split(';').map(item => item.trim()).filter(Boolean);
            }
            // If contains newlines, split by \n
            if (text.includes('\n')) {
              return text.split('\n').map(item => item.trim().replace(/^[0-9]+[\.\)]\s*/, '')).filter(Boolean);
            }
            // If contains "1. ... 2. ..."
            if (/\d+[\.\)]\s+/.test(text)) {
              return text.split(/\d+[\.\)]\s+/).map(item => item.trim()).filter(Boolean);
            }
            return [text.trim()];
          };

          const pList = splitList(rawPenyebab);
          const sList = splitList(rawLangkah);

          detectedCatsSet.add(kategori);

          parsed.push({
            id: `g-xls-${Date.now()}-${index + 1}`,
            c: kategori,
            t: judul,
            g: gejala,
            p: pList.length > 0 ? pList : ['Penyebab hardware atau sistem'],
            s: sList.length > 0 ? sList : ['Periksa perangkat dan uji coba komponen'],
            k: kapanTeknisi,
            a: alat,
            afUrl: linkAfiliasi || undefined,
            updatedAt: new Date().toISOString().split('T')[0]
          });
        });

        if (parsed.length === 0) {
          setErrorMsg('Tidak ada baris yang valid ditemukan. Pastikan kolom "Judul_Masalah" terisi.');
          return;
        }

        setParsedGuides(parsed);
        setDetectedCategories(Array.from(detectedCatsSet));
      } catch (err: any) {
        console.error(err);
        setErrorMsg('Gagal membaca file spreadsheet: ' + (err.message || 'Format tidak didukung'));
      }
    };
    reader.readAsBinaryString(file);
  };

  // Execute import
  const handleApplyImport = () => {
    if (parsedGuides.length === 0) return;

    // Detect if there are any new categories not currently in list
    const newCatsToAdd = detectedCategories.filter(cat => !categories.includes(cat));

    onImportSuccess(parsedGuides, importMode, newCatsToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full my-8 overflow-hidden shadow-2xl animate-scale-up">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                Impor Massal Excel
              </div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-white">
                Input Panduan Kolektif (.xls / .xlsx / .csv)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Step 1: Download Template */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-xs sm:text-sm text-emerald-950 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-700" />
                <span>Unduh Format Template Excel Terlebih Dahulu</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Gunakan template resmi kami yang sudah berisi kolom <em>Kategori, Judul, Gejala, Penyebab, Langkah, Bahaya/Teknisi,</em> dan <em>Alat</em> siap pakai.
              </p>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Template .xlsx</span>
            </button>
          </div>

          {/* Step 2: Upload Area */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Pilih atau Tarik File Excel (.xls, .xlsx, .csv)
            </label>
            
            <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-amber-50/30 transition-all text-center">
              <Upload className="w-8 h-8 text-slate-400" />
              <div className="text-xs sm:text-sm font-semibold text-slate-800">
                {fileName ? fileName : 'Klik untuk memilih file Excel dari komputer/HP'}
              </div>
              <p className="text-[11px] text-slate-500">
                Mendukung file Microsoft Excel (.xls, .xlsx) dan CSV Spreadsheet
              </p>
              <input
                type="file"
                accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 3: Preview Data Parsed */}
          {parsedGuides.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-slate-200">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ditemukan <strong>{parsedGuides.length}</strong> panduan valid dari file Excel!</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500">Mode Impor:</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-slate-700">Gabungkan (Append)</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-red-700">Gantikan Semua (Replace)</span>
                  </label>
                </div>
              </div>

              {/* Detected categories notice */}
              {detectedCategories.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Kategori terdeteksi di Excel:</span>
                  <div className="flex flex-wrap gap-1">
                    {detectedCategories.map(cat => (
                      <span key={cat} className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-medium text-[11px]">
                        {cat} {categories.includes(cat) ? '' : '(Baru)'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Table Preview of Guides */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">No.</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3">Judul Masalah</th>
                      <th className="py-2.5 px-3">Jumlah Langkah</th>
                      <th className="py-2.5 px-3">Alat Rekomendasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedGuides.map((g, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-2 px-3">
                          <span className="font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded text-[10px]">
                            {g.c}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-800 max-w-xs truncate">
                          {g.t}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {g.s.length} langkah
                        </td>
                        <td className="py-2 px-3 text-slate-500 truncate max-w-[150px]">
                          {g.a}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* Guidance note */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>Petunjuk Pengisian Spreadsheet:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
              <li>Pemisah daftar langkah atau penyebab di Excel bisa memakai tanda titik koma (;) atau nomor (1. 2. 3.).</li>
              <li>Kolom <strong>Judul_Masalah</strong> wajib diisi agar baris dapat diproses.</li>
              <li>Jika kolom <strong>Kategori</strong> berisi nama baru (misal: "Monitor" atau "Smartphone"), sistem akan otomatis mendaftarkannya ke kategori web.</li>
            </ul>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm text-slate-600 hover:text-slate-900 rounded-lg font-medium"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleApplyImport}
            disabled={parsedGuides.length === 0}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>
              {parsedGuides.length > 0 
                ? `Impor ${parsedGuides.length} Panduan Sekarang (${importMode === 'append' ? 'Gabungkan' : 'Gantikan'})`
                : 'Pilih File Excel Dulu'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
