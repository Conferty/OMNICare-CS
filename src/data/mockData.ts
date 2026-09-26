import { DomainType, ToneType, RecommendationItem, TrackingResult, WeatherResult, BookingResult } from '../types';

export interface DomainMeta {
  id: DomainType;
  name: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  badgeBg: string;
  agentName: string;
  welcomeMessage: {
    FORMAL: string;
    CASUAL: string;
    CONCISE: string;
    EMPATHETIC: string;
  };
  quickChips: string[];
  recommendations: RecommendationItem[];
  knowledgeOverview: string;
}

export const DOMAINS: Record<DomainType, DomainMeta> = {
  HEALTH: {
    id: 'HEALTH',
    name: 'Kesehatan & Wellness',
    subtitle: 'Klinik MedikaCare Sejahtera',
    icon: 'HeartPulse',
    accentColor: 'emerald',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    agentName: 'Dr. Ryan & Tim MedikaCare',
    welcomeMessage: {
      FORMAL: 'Selamat datang di Layanan Informasi MedikaCare. Saya asisten virtual kesehatan Anda. Ada yang dapat kami bantu mengenai jadwal dokter, paket MCU, atau panduan keluhan kesehatan Anda hari ini?',
      CASUAL: 'Halo kak! Selamat datang di MedikaCare 🩺 Ada keluhan kesehatan atau mau tanya jadwal praktek dokter spesialis? Kasih tahu aku ya, siap bantu dengan senang hati!',
      CONCISE: 'Halo! Customer Service MedikaCare siap melayani. Silakan pilih: Cek Jadwal Dokter, Booking MCU, Antrean Poli, atau Info Gejala.',
      EMPATHETIC: 'Halo, semoga Anda dan keluarga selalu dilindungi kesehatan. Kami sangat peduli dengan kenyamanan Anda. Ceritakan kendala atau kebutuhan kesehatan Anda, kami dampingi solusinya.'
    },
    quickChips: [
      'Jadwal dokter spesialis anak hari ini',
      'Pertolongan pertama demam tinggi balita',
      'Paket Medical Check-Up & Biaya',
      'Cek nomor antrean poli POLI-03',
      'Booking konsultasi dokter umum'
    ],
    knowledgeOverview: `Klinik MedikaCare Sejahtera:
- Buka 24 Jam (UGD & Farmasi), Poli Spesialis: Senin-Sabtu 08.00-21.00.
- Dokter Spesialis Anak: dr. Sarah Sp.A (Senin, Rabu, Jumat 09.00-14.00).
- Dokter Penyakit Dalam: dr. Budi Santoso Sp.PD (Selasa, Kamis, Sabtu 13.00-18.00).
- Dokter Gigi: drg. Anita Wijaya (Setiap hari kerja 10.00-16.00).
- Layanan Lab & MCU: Paket Dasar (Rp 350.000), Paket Eksekutif (Rp 750.000), Paket Kardiovaskular (Rp 1.200.000).
- Kebijakan Darurat: Jika pasien mengalami nyeri dada akut, sesak napas berat, atau pingsan, segera arahkan ke UGD atau telepon 119/UGD kami di (021) 7890-1122.`,
    recommendations: [
      {
        id: 'rec-h1',
        title: 'Paket MCU Eksekutif',
        category: 'Pemeriksaan Lab',
        description: 'Pemeriksaan darah lengkap, fungsi ginjal, kolesterol, EKG jantung & konsultasi dokter spesialis.',
        price: 'Rp 750.000',
        badge: 'Terpopuler',
        promptToAsk: 'Bisa jelaskan detail paket MCU Eksekutif dan cara persiapannya?'
      },
      {
        id: 'rec-h2',
        title: 'Telekonsultasi Dokter 24/7',
        category: 'Konsultasi Online',
        description: 'Tanya dokter umum dan tebus resep digital langsung diantar ke rumah tanpa antre.',
        price: 'Rp 45.000',
        badge: 'Praktis',
        promptToAsk: 'Bagaimana cara booking telekonsultasi dokter 24/7?'
      },
      {
        id: 'rec-h3',
        title: 'Imun Booster Vitamin C & Zinc',
        category: 'Terapi Sehat',
        description: 'Injeksi vitamin dosis aman untuk pemulihan flu, stamina drop, dan daya tahan tubuh.',
        price: 'Rp 180.000',
        badge: 'Promo 15%',
        promptToAsk: 'Apakah imun booster vitamin C cocok untuk orang yang baru sembuh sakit?'
      }
    ]
  },

  EDUCATION: {
    id: 'EDUCATION',
    name: 'Edukasi & Kursus Online',
    subtitle: 'EduSphere Academy & Tech Bootcamp',
    icon: 'GraduationCap',
    accentColor: 'indigo',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    agentName: 'Kak Maya - Student Advisor EduSphere',
    welcomeMessage: {
      FORMAL: 'Selamat datang di Layanan Informasi EduSphere Academy. Saya asisten konsultan akademik Anda. Bagaimana kami dapat membantu rencana peningkatan karir digital atau studi Anda?',
      CASUAL: 'Halo kak! Selamat datang di EduSphere Academy 🚀 Mau beralih karir ke bidang teknologi, coding, atau data science? Tanya apa aja seputar kelas dan beasiswa ya!',
      CONCISE: 'Halo! EduSphere Academy siap bantu: Info Bootcamp, Skema Cicilan/Beasiswa, Jadwal Batch, atau Konsultasi Kurikulum.',
      EMPATHETIC: 'Halo! Memulai hal baru di dunia teknologi tentu membutuhkan panduan yang tepat. Kami siap mendengarkan aspirasi dan membantu Anda melangkah dengan percaya diri.'
    },
    quickChips: [
      'Apakah pemula non-IT bisa ikut Data Science?',
      'Syarat pendaftaran beasiswa full 100%',
      'Berapa biaya & opsi cicilan bootcamp Fullstack?',
      'Cek status pendaftaran BEA-2026-891',
      'Jadwal batch baru yang paling dekat'
    ],
    knowledgeOverview: `EduSphere Academy:
- Program Unggulan: Fullstack Web (React & Node.js, 16 minggu), Data Science & AI (Python & ML, 14 minggu), UI/UX Product Design (10 minggu), DevOps Engineer (8 minggu).
- Format Belajar: Live Mentoring malam hari (19.00-21.30 WIB) + LMS video + Real-world Portfolio Capstone.
- Garansi Kerja / Hiring Partner: 150+ perusahaan mitra (Unicorn, Bank BUMN, Startup).
- Biaya & Pembayaran: Fullstack (Rp 8.500.000 / cicilan 0% 6-12 bulan via kartu kredit/Cicil), Data Science (Rp 9.200.000).
- Beasiswa: Program Beasiswa Talenta Masa Depan (diskon hingga 100% dengan seleksi portofolio & tes logika).`,
    recommendations: [
      {
        id: 'rec-e1',
        title: 'Bootcamp Fullstack Web Developer',
        category: 'Full-time / Part-time',
        description: 'Belajar dari nol hingga siap kerja: TypeScript, React 19, Node.js, REST API, & Cloud Deploy.',
        price: 'Rp 8.500.000 (Cicilan Rp 708rb/bln)',
        badge: 'Jaminan Karir',
        promptToAsk: 'Bisa jelaskan silabus Bootcamp Fullstack Web Developer dari awal sampai akhir?'
      },
      {
        id: 'rec-e2',
        title: 'AI & Data Science Specialist',
        category: 'Data & Machine Learning',
        description: 'Kuasai Python, SQL, Analisis Data, Machine Learning modern, dan implementasi Gemini AI.',
        price: 'Rp 9.200.000',
        badge: 'Paling Diminati',
        promptToAsk: 'Materi apa saja yang dipelajari di Bootcamp AI & Data Science?'
      },
      {
        id: 'rec-e3',
        title: 'Free Career Consultation & Test Minat',
        category: 'Gratis 100%',
        description: 'Sesi 30 menit bareng konsultan karir untuk memetakan potensi dan jalur tech terbaikmu.',
        price: 'GRATIS',
        badge: 'Rekomendasi Awal',
        promptToAsk: 'Saya ingin daftar Free Career Consultation, bagaimana prosesnya?'
      }
    ]
  },

  HOBBY: {
    id: 'HOBBY',
    name: 'Hobi & Perlengkapan Outdoor',
    subtitle: 'GiriVentures Mountain & Camp Gear',
    icon: 'Compass',
    accentColor: 'amber',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    agentName: 'Bro Danu - Gear Specialist GiriVentures',
    welcomeMessage: {
      FORMAL: 'Selamat datang di Pusat Pelayanan Pelanggan GiriVentures. Kami siap membantu Anda memilih perlengkapan pendakian dan ekspedisi alam terbaik dengan standar keamanan tinggi.',
      CASUAL: 'Yo halo petualang! Selamat datang di GiriVentures ⛺ Mau naik gunung mana minggu ini? Butuh saran gear tenda, carrier, atau cek status resi pesananmu? Sikat!',
      CONCISE: 'Halo pendaki! GiriVentures CS siap bantu: Cek Resi Pesanan, Rekomendasi Tenda/Carrier, Info Cuaca Gunung, atau Klaim Garansi.',
      EMPATHETIC: 'Halo rekan petualang! Keselamatan dan kenyamanan ekspedisi Anda adalah prioritas kami. Sampaikan perlengkapan yang Anda cari atau kendala yang dialami, kami bantu carikan solusi terandal.'
    },
    quickChips: [
      'Rekomendasi tenda 2P ringan & tahan badai',
      'Cek resi pengiriman RESI-GRV-8821',
      'Bagaimana cara klaim garansi frame tenda patah?',
      'Info cuaca dan tips naik Gunung Gede',
      'Tips memilih carrier 50L vs 60L untuk pemula'
    ],
    knowledgeOverview: `GiriVentures Outdoor Equipment:
- Produk: Tenda Ultralight, Carrier Ergonomis, Sleeping Bag Bulu Angsa, Sepatu Trekking Waterproof, Matras Tiup, Kompor Windproof.
- Garansi Resmi: Seumur hidup (Lifetime Warranty) untuk jahitan utama carrier dan frame aluminium tenda.
- Pengiriman: Bekerja sama dengan JNE, SiCepat, J&T Cargo. Pengiriman instan GoSend/Grab khusus Jabodetabek.
- Kebijakan Penukaran Ukuran (Size Exchange): Maksimal 7 hari sejak barang diterima jika sepatu/jaket tidak pas.
- Rekomendasi Cuaca Gunung: Bekerjasama dengan pos pengamatan cuaca gunung untuk info jalur buka/tutup.`,
    recommendations: [
      {
        id: 'rec-o1',
        title: 'Tenda Apex 2P Stormproof (1.45 kg)',
        category: 'Ultralight Shelter',
        description: 'Bahan 20D Ripstop Silnylon, water column 4000mm, frame DAC aluminium aero grade.',
        price: 'Rp 1.150.000',
        badge: 'Best Seller',
        promptToAsk: 'Apa keunggulan tenda Apex 2P Stormproof dibanding tenda biasa?'
      },
      {
        id: 'rec-o2',
        title: 'Carrier Pathfinder 60+10L Pro',
        category: 'Backpack Ekspedisi',
        description: 'Sistem punggung Aerovent anti-gerah, bantalan bahu busa EVA ganda, bonus Raincover.',
        price: 'Rp 980.000',
        badge: 'Garansi Seumur Hidup',
        promptToAsk: 'Apakah carrier Pathfinder 60+10L cocok untuk postur tinggi 165cm?'
      },
      {
        id: 'rec-o3',
        title: 'Trekking Pole Carbon Pro (Sepasang)',
        category: 'Aksesoris Mendaki',
        description: 'Ultra ringan hanya 190 gram per batang, flip-lock baja tahan karat, grip busa gabus alami.',
        price: 'Rp 340.000',
        badge: 'Diskon 20%',
        promptToAsk: 'Bisa jelaskan ketahanan Trekking Pole Carbon Pro?'
      }
    ]
  },

  SAAS: {
    id: 'SAAS',
    name: 'SaaS & Cloud Business',
    subtitle: 'CloudScale Infrastructure & DevOps',
    icon: 'Server',
    accentColor: 'cyan',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800',
    agentName: 'Alex - Cloud Technical Specialist',
    welcomeMessage: {
      FORMAL: 'Selamat datang di Technical Support CloudScale. Kami siap membantu terkait manajemen infrastruktur VPS, database, penagihan, serta eskalasi tiket darurat 24/7.',
      CASUAL: 'Halo rekan engineer! Selamat datang di CloudScale Tech Support ⚡ Ada isu deploy, server lag, invoice billing, atau setup database cluster? Langsung gas!',
      CONCISE: 'Halo! CloudScale CS: Cek Status Server, Bantuan API/Deploy, Status Invoice INV-CS-991, atau Buka Tiket Kendala.',
      EMPATHETIC: 'Halo, kami memahami betapa krusialnya uptime dan stabilitas sistem bagi bisnis Anda. Jangan khawatir, tim kami akan mendampingi investigasi hingga masalah teratasi tuntas.'
    },
    quickChips: [
      'Solusi error 502 Bad Gateway di server VPS',
      'Cek status faktur invoice INV-CS-991',
      'Cara upgrade spesifikasi server tanpa downtime',
      'Cek status server datacenter Jakarta',
      'Buka tiket kendala teknis TKT-1049'
    ],
    knowledgeOverview: `CloudScale Infrastructure:
- Data Center: Jakarta (JKT-01, JKT-02 Tier IV), Singapura, Tokyo, Virginia.
- Layanan: Cloud Compute VPS (KVM NVMe), Managed PostgreSQL/MySQL, Object Storage S3 Compatible, Global CDN + WAF.
- SLA Uptime: 99.99% dengan garansi credit kompensasi jika terjadi downtime di luar jadwal maintenance.
- Billing: Pasca bayar & prabayar, dukungan pembayaran Virtual Account, QRIS, Kartu Kredit, Faktur Pajak otomatis.
- Kontak Darurat NOC: 24/7 via tiket prioritas atau hotline +62 21 5088 9000.`,
    recommendations: [
      {
        id: 'rec-s1',
        title: 'Dedicated Cloud VPS 4 Core / 8GB',
        category: 'High Performance',
        description: 'NVMe Gen4 SSD 160GB, Bandwidth 5TB unmetered, Free Automated Daily Snapshot.',
        price: 'Rp 299.000 / bulan',
        badge: 'Paling Populer',
        promptToAsk: 'Bagaimana performa VPS 4 Core untuk website e-commerce dengan 50.000 pengunjung harian?'
      },
      {
        id: 'rec-s2',
        title: 'Managed PostgreSQL High Availability',
        category: 'Database Cluster',
        description: 'Otomatis failover, read replica, backup point-in-time recovery hingga 30 hari.',
        price: 'Rp 450.000 / bulan',
        badge: 'Enterprise SLA',
        promptToAsk: 'Bagaimana fitur failover otomatis pada Managed PostgreSQL CloudScale bekerja?'
      },
      {
        id: 'rec-s3',
        title: 'Enterprise Anti-DDoS & Web Shield',
        category: 'Keamanan Siber',
        description: 'Mitigasi serangan Layer 3, 4, dan Layer 7 real-time hingga kapasitas 3.2 Tbps.',
        price: 'Rp 199.000 / bulan',
        badge: 'WAF & SSL',
        promptToAsk: 'Apakah paket Enterprise Anti-DDoS sudah mencakup SSL Wildcard gratis?'
      }
    ]
  },

  CUSTOM: {
    id: 'CUSTOM',
    name: 'Domain Kustom Anda',
    subtitle: 'Knowledge Base Khusus Bisnis Anda',
    icon: 'Settings',
    accentColor: 'violet',
    badgeBg: 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800',
    agentName: 'Asisten Layanan Pelanggan',
    welcomeMessage: {
      FORMAL: 'Selamat datang. Kami asisten layanan pelanggan resmi siap menjawab pertanyaan Anda mengenai produk dan layanan kami.',
      CASUAL: 'Halo kak! Selamat datang di customer service kami 😊 Ada yang bisa dibantu hari ini?',
      CONCISE: 'Halo! Layanan pelanggan siap membantu Anda. Silakan sampaikan pertanyaan atau kendala Anda.',
      EMPATHETIC: 'Halo, terima kasih telah menghubungi kami. Kami selalu berusaha memberikan pelayanan terbaik untuk kepuasan Anda.'
    },
    quickChips: [
      'Apa saja produk atau layanan unggulan Anda?',
      'Bagaimana cara memesan atau berlangganan?',
      'Berapa lama estimasi pengiriman atau pengerjaan?',
      'Kebijakan garansi dan pengembalian dana',
      'Hubungi customer support manusia'
    ],
    knowledgeOverview: `Basis Pengetahuan Kustom: Masukkan data FAQ, jam operasional, dan info produk bisnis Anda melalui tombol pengaturan custom di sidebar.`,
    recommendations: [
      {
        id: 'rec-c1',
        title: 'Layanan Konsultasi Utama',
        category: 'Layanan Bisnis',
        description: 'Solusi lengkap yang disesuaikan dengan kebutuhan pelanggan secara personal.',
        price: 'Konsultasi Gratis',
        badge: 'Unggulan',
        promptToAsk: 'Bisa jelaskan alur konsultasi dan estimasi biaya layanan ini?'
      }
    ]
  }
};

export const TONES: Record<ToneType, { label: string; desc: string; icon: string }> = {
  FORMAL: {
    label: 'Formal & Santun',
    desc: 'Baku, sopan, terstruktur rapi untuk instansi dan kebutuhan resmi.',
    icon: 'Briefcase'
  },
  CASUAL: {
    label: 'Santai & Akrab',
    desc: 'Hangat, bersahabat, emoji ramah ("Halo kak!").',
    icon: 'Smile'
  },
  CONCISE: {
    label: 'Cepat & Ringkas',
    desc: 'Padat, bullet points, hemat waktu langsung ke poin solusi.',
    icon: 'Zap'
  },
  EMPATHETIC: {
    label: 'Empatik & Solutif',
    desc: 'Memvalidasi keluhan, menenangkan, dan solutif langkah demi langkah.',
    icon: 'Heart'
  }
};

// Mock external APIs data
export const MOCK_TRACKING_DATABASE: Record<string, TrackingResult> = {
  'RESI-GRV-8821': {
    code: 'RESI-GRV-8821',
    type: 'ORDER',
    title: 'Pesanan GiriVentures: Tenda Apex 2P Stormproof',
    status: 'Sedang Diantar Kurir (Out for Delivery)',
    courierOrAgent: 'SiCepat Ekspres (Kurir: Pak Hendra - 0812-9988-1122)',
    estimatedDeliveryOrResponse: 'Hari ini sebelum pukul 17.00 WIB',
    timeline: [
      { time: '2026-09-25 14:15 WIB', description: 'Paket dibawa kurir Pak Hendra menuju alamat tujuan.', location: 'Hub Cilandak, Jakarta Selatan', completed: true },
      { time: '2026-09-25 08:30 WIB', description: 'Paket tiba di sorting hub regional.', location: 'DC Jakarta Selatan', completed: true },
      { time: '2026-09-24 19:40 WIB', description: 'Paket diteruskan dari gudang pusat pengirim.', location: 'Gudang GiriVentures Bandung', completed: true },
      { time: '2026-09-24 13:00 WIB', description: 'Pesanan telah dipacking dan diserahkan ke pihak ekspedisi.', location: 'Bandung', completed: true }
    ]
  },
  'TKT-1049': {
    code: 'TKT-1049',
    type: 'TICKET',
    title: 'Tiket Kendala: Investigasi Latency Database Cluster',
    status: 'Dalam Penanganan Tim Senior DevOps (In Progress)',
    courierOrAgent: 'DevOps Engineer: Gilang Prasetyo (L3 NOC)',
    estimatedDeliveryOrResponse: 'Resolusi diperkirakan dalam 25 menit (Pukul 19.15 WIB)',
    timeline: [
      { time: '2026-09-25 18:05 WIB', description: 'Patch query optimizer dan restart replica instance sedang dijalankan.', location: 'DC Jakarta Tier IV', completed: true },
      { time: '2026-09-25 17:40 WIB', description: 'Tiket dieskalasi ke Level 3 DevOps Lead untuk analisis load spike.', location: 'NOC CloudScale', completed: true },
      { time: '2026-09-25 17:22 WIB', description: 'Tiket keluhan diterima via portal CS dan diverifikasi otomatis.', location: 'Helpdesk Portal', completed: true }
    ]
  },
  'INV-CS-991': {
    code: 'INV-CS-991',
    type: 'INVOICE',
    title: 'Faktur CloudScale: Paket Dedicated VPS NVMe 4-Core',
    status: 'LUNAS (Paid & Active)',
    courierOrAgent: 'Sistem Pembayaran Otomatis Midtrans / VA BCA',
    estimatedDeliveryOrResponse: 'Layanan aktif hingga 25 Oktober 2026',
    timeline: [
      { time: '2026-09-25 09:12 WIB', description: 'Pembayaran Rp 299.000 berhasil diverifikasi dan faktur pajak terbit.', location: 'Billing Gateway', completed: true },
      { time: '2026-09-25 09:05 WIB', description: 'Invoice diterbitkan otomatis untuk siklus perpanjangan bulanan.', location: 'Billing Gateway', completed: true }
    ]
  },
  'BEA-2026-891': {
    code: 'BEA-2026-891',
    type: 'TICKET',
    title: 'Aplikasi Beasiswa Talenta: Fullstack Web Development',
    status: 'LOLOS Tahap Seleksi Portofolio (Menunggu Wawancara)',
    courierOrAgent: 'Panitia Seleksi: Kak Nadiya & Tim Akademik',
    estimatedDeliveryOrResponse: 'Jadwal wawancara online: Sabtu, 28 September 2026 pukul 10.00 WIB',
    timeline: [
      { time: '2026-09-25 11:00 WIB', description: 'Berkas portofolio dan hasil tes logika dinyatakan LULUS (Skor 92/100).', location: 'Portal Penerimaan Mahasiswa', completed: true },
      { time: '2026-09-22 15:30 WIB', description: 'Aplikasi pendaftaran diterima sistem dan diverifikasi kelengkapannya.', location: 'Portal Penerimaan Mahasiswa', completed: true }
    ]
  },
  'POLI-03': {
    code: 'POLI-03',
    type: 'BOOKING',
    title: 'Nomor Antrean: Poli Spesialis Anak dr. Sarah Sp.A',
    status: 'Sedang Melayani Nomor Antrean 02 (Giliran Anda Berikutnya)',
    courierOrAgent: 'Perawat Penanggung Jawab: Ns. Ratna S.Kep',
    estimatedDeliveryOrResponse: 'Estimasi dipanggil: 15 menit lagi (Pukul 18.50 WIB)',
    timeline: [
      { time: '2026-09-25 18:25 WIB', description: 'Pasien antrean 02 sedang berkonsultasi di ruang pemeriksaan 3A.', location: 'Klinik MedikaCare Lantai 2', completed: true },
      { time: '2026-09-25 17:50 WIB', description: 'Pemeriksaan tanda vital (tensi & berat badan) selesai di meja perawat.', location: 'Nurse Station', completed: true },
      { time: '2026-09-25 17:15 WIB', description: 'Check-in mandiri di kios pendaftaran klinik berhasil.', location: 'Lobi Utama', completed: true }
    ]
  }
};

export const MOCK_WEATHER_DATABASE: Record<string, WeatherResult> = {
  'gede': {
    location: 'Gunung Gede Pangrango (Jalur Cibodas - Surya Kencana)',
    temperature: '14°C - 18°C (Malam 9°C)',
    condition: 'Cerah Berawan, Potensi Kabut Tebal Sore Hari',
    humidity: '82%',
    windSpeed: '12 km/jam (Kecepatan Angin Aman)',
    hikingAdvice: 'Jalur resmi BUKA. Wajib membawa jas hujan, jaket windproof/down jacket, dan headlamp cadangan karena suhu puncak relatif dingin.'
  },
  'merbabu': {
    location: 'Gunung Merbabu (Jalur Selo - Suwanting)',
    temperature: '12°C - 16°C',
    condition: 'Cerah di Pagi Hari, Angin Cukup Kencang di Sabana 2',
    humidity: '75%',
    windSpeed: '24 km/jam',
    hikingAdvice: 'Jalur BUKA. Pasak tenda ekstra dan guyline wajib dipasang kuat di area Sabana karena terpaan angin savana.'
  },
  'bromo': {
    location: 'Kawasan Wisata Taman Nasional Bromo Tengger Semeru',
    temperature: '10°C - 15°C (Dini Hari 5°C)',
    condition: 'Cerah Jernih, Kondisi Sunrise View Point Optimal',
    humidity: '68%',
    windSpeed: '15 km/jam',
    hikingAdvice: 'Sangat direkomendasikan memakai sarung tangan polar, kupluk/beanie, dan masker debu pasir.'
  },
  'jakarta': {
    location: 'Wilayah Jabodetabek & Sekitarnya',
    temperature: '28°C - 33°C',
    condition: 'Cerah Berawan, Potensi Hujan Ringan Lokal Sore Hari',
    humidity: '72%',
    windSpeed: '10 km/jam',
    hikingAdvice: 'Kondisi operasional klinik, kurir ekspedisi, dan pengiriman barang berjalan lancar tanpa kendala cuaca ekstrem.'
  }
};
