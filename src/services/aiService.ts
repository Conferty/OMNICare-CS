import {
  ChatRequestPayload,
  ChatResponsePayload,
  DomainType,
  ToneType,
  UserMemory,
  SentimentType,
  MessageCard,
  RecommendationItem
} from '../types';
import { DOMAINS, TONES } from '../data/mockData';
import { ExternalApiService } from './apiService';

export class AiChatService {
  /**
   * Main entry point to send chat message
   */
  static async sendMessage(payload: ChatRequestPayload): Promise<ChatResponsePayload> {
    const userMessage = payload.messages[payload.messages.length - 1]?.content || '';

    // Step 1: Check for External API triggers (Tracking, Weather, Booking)
    const trackingCodeMatch = userMessage.match(/\b(RESI-[A-Z0-9-]+|TKT-[A-Z0-9-]+|INV-[A-Z0-9-]+|POLI-[A-Z0-9-]+|BEA-[A-Z0-9-]+)\b/i) ||
      userMessage.match(/\b(RESI|INV|TKT|POLI|BEA)\s*([0-9A-Z-]+)\b/i);

    let attachedCard: MessageCard | undefined = undefined;
    let externalApiContext = '';

    if (trackingCodeMatch) {
      const code = trackingCodeMatch[0].replace(/\s+/g, '-').toUpperCase();
      const trackingResult = await ExternalApiService.trackStatus(code);
      if (trackingResult) {
        attachedCard = {
          type: 'TRACKING',
          trackingData: trackingResult
        };
        externalApiContext = `[HASIL SISTEM TRACKING EKSTERNAL]: Ditemukan data untuk kode ${trackingResult.code}. Status saat ini: ${trackingResult.status}. Kurir/Petugas: ${trackingResult.courierOrAgent || '-'}. Estimasi: ${trackingResult.estimatedDeliveryOrResponse || '-'}. Sampaikan informasi ini dengan ramah kepada pengguna.`;
      }
    }

    // Weather check
    if (/cuaca|suhu|kondisi jalur|hujan|angin/i.test(userMessage) && (payload.domain === 'HOBBY' || /gede|merbabu|bromo|gunung/i.test(userMessage))) {
      const weather = await ExternalApiService.checkWeather(userMessage);
      externalApiContext += `\n[DATA CUACA REAL-TIME]: Lokasi: ${weather.location}, Suhu: ${weather.temperature}, Kondisi: ${weather.condition}, Angin: ${weather.windSpeed}, Rekomendasi/Saran: ${weather.hikingAdvice}.`;
    }

    // Booking check
    if (/mau booking|janji temu|daftar konsultasi|reservasi|jadwal temu/i.test(userMessage)) {
      const sampleBooking = await ExternalApiService.createBooking({
        userName: payload.memory.userName || 'Pelanggan',
        domain: payload.domain,
        serviceName: payload.domain === 'HEALTH' ? 'Konsultasi Dokter Spesialis' : payload.domain === 'EDUCATION' ? 'Sesi Mentoring 1-on-1' : 'Konsultasi Ahli Produk',
        preferredDate: 'Besok',
        preferredTime: '10:00 - 11:00 WIB'
      });
      attachedCard = {
        type: 'BOOKING',
        bookingData: sampleBooking
      };
      externalApiContext += `\n[SISTEM BOOKING TERINTEGRASI]: Telah dibuatkan reservasi janji temu awal dengan ID ${sampleBooking.bookingId} untuk layanan ${sampleBooking.serviceName}.`;
    }

    // Step 2: Try calling server-side API `/api/chat` (powered by Gemini 2.5 Flash)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          externalApiContext
        })
      });

      if (res.ok) {
        const data: ChatResponsePayload = await res.json();
        return {
          ...data,
          card: attachedCard || data.card,
          recommendations: data.recommendations || ExternalApiService.getRecommendations(payload.domain, userMessage)
        };
      }
    } catch {
      // In dev or offline without backend, fall through to intelligent local fallback engine
    }

    // Step 3: Intelligent Contextual Local CS Engine
    return this.generateSmartLocalResponse(payload, userMessage, externalApiContext, attachedCard);
  }

  /**
   * High-accuracy contextual fallback engine that adheres to domain knowledge,
   * tone of voice, customer memory extraction, and sentiment analysis.
   */
  private static generateSmartLocalResponse(
    payload: ChatRequestPayload,
    userMessage: string,
    externalApiContext: string,
    attachedCard?: MessageCard
  ): ChatResponsePayload {
    const domain = payload.domain;
    const tone = payload.tone;
    const memory = { ...payload.memory };
    const domainMeta = DOMAINS[domain];
    const textLower = userMessage.toLowerCase();

    // 1. Sentiment Detection
    let sentiment: SentimentType = 'NEUTRAL';
    if (/kecewa|rusak|lama|komplain|rugi|marah|payah|cacat|batal|buruk|lambat|error|down/i.test(textLower)) {
      sentiment = 'FRUSTRATED';
    } else if (/terima kasih|makasih|mantap|keren|puas|bagus|hebat|suka|senang/i.test(textLower)) {
      sentiment = 'POSITIVE';
    } else if (/bagaimana|apakah|bisa|apa|berapa|kapan|kenapa|tolong/i.test(textLower)) {
      sentiment = 'CURIOUS';
    }

    // If customer is frustrated, suggest human escalation
    if (sentiment === 'FRUSTRATED' && !attachedCard) {
      attachedCard = {
        type: 'ESCALATION',
        escalationTicketId: `ESC-${Date.now().toString().slice(-5)}`
      };
    }

    // 2. Memory Extraction
    const updatedMemory: Partial<UserMemory> = {};

    // Extract user name
    const nameMatch = userMessage.match(/(?:nama saya|panggil saya|saya)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (nameMatch && nameMatch[1]) {
      const extractedName = nameMatch[1].trim();
      if (!['mau', 'bisa', 'ingin', 'adalah', 'sedang'].includes(extractedName.toLowerCase())) {
        updatedMemory.userName = extractedName;
        memory.userName = extractedName;
      }
    }

    // Extract preferences
    const newPrefs: string[] = [...memory.preferences];
    if (/alergi/i.test(textLower)) {
      const pref = userMessage.slice(Math.max(0, textLower.indexOf('alergi')), textLower.indexOf('alergi') + 40);
      if (!newPrefs.includes(pref)) newPrefs.push(pref.trim());
    }
    if (/pemula|non-it|belum pernah/i.test(textLower) && domain === 'EDUCATION') {
      if (!newPrefs.includes('Pemula tanpa background IT')) newPrefs.push('Pemula tanpa background IT');
    }
    if (/budget|harga di bawah|maksimal/i.test(textLower)) {
      const budgetMatch = userMessage.match(/(?:budget|maksimal|di bawah)\s*([0-9\s.,]+(?:ribu|jt|juta|rb)?)/i);
      if (budgetMatch) {
        newPrefs.push(`Budget: ${budgetMatch[1].trim()}`);
      }
    }
    if (/tenda|carrier|sepatu/i.test(textLower) && domain === 'HOBBY') {
      if (!newPrefs.includes('Minat: Perlengkapan Gunung')) newPrefs.push('Minat: Perlengkapan Gunung');
    }
    if (newPrefs.length !== memory.preferences.length) {
      updatedMemory.preferences = newPrefs;
    }

    // 3. Craft response tailored by domain, knowledge, and tone
    const reply = this.buildContextualText(domain, tone, userMessage, memory, externalApiContext, sentiment);
    const recommendations = ExternalApiService.getRecommendations(domain, userMessage);

    return {
      reply,
      updatedMemory,
      sentiment,
      card: attachedCard,
      recommendations
    };
  }

  private static buildContextualText(
    domain: DomainType,
    tone: ToneType,
    userMessage: string,
    memory: UserMemory,
    externalApiContext: string,
    sentiment: SentimentType
  ): string {
    const textLower = userMessage.toLowerCase();
    const customerSalutation = memory.userName
      ? (tone === 'FORMAL' ? `Bapak/Ibu ${memory.userName}` : `Kak ${memory.userName}`)
      : (tone === 'FORMAL' ? 'Bapak/Ibu' : 'Kak');

    // Handle tracking context if available
    if (externalApiContext.includes('[HASIL SISTEM TRACKING EKSTERNAL]')) {
      if (tone === 'FORMAL') {
        return `Terima kasih telah menunggu, ${customerSalutation}. Kami telah melakukan penelusuran pada sistem pusat kami.\n\nDetail status telah kami lampirkan pada kartu pelacakan di bawah ini. Anda dapat melihat riwayat tahapan transit secara langsung. Apakah ada informasi tambahan mengenai pesanan atau tiket ini yang ingin kami konfirmasi kembali?`;
      } else if (tone === 'CASUAL') {
        return `Siap ${customerSalutation}! Ini dia status terbarunya langsung dari sistem kami ✨\n\nDetail lengkapnya sudah aku tampilin di card pelacakan bawah ini ya. Statusnya aman dan terus terpantau. Ada hal lain yang mau dicek lagi?`;
      } else if (tone === 'CONCISE') {
        return `Data pelacakan ditemukan. Rincian status dan timeline pergerakan tertera pada kartu di bawah.`;
      } else {
        return `Terima kasih sudah menanyakan status ini, ${customerSalutation}. Kami memahami pentingnya kepastian ini bagi Anda. Informasi pelacakan real-time telah kami sediakan pada kartu di bawah. Kami pastikan prosesnya terpantau hingga tuntas.`;
      }
    }

    // Handle Weather context
    if (externalApiContext.includes('[DATA CUACA REAL-TIME]')) {
      if (tone === 'CASUAL') {
        return `Halo ${customerSalutation}! Ini rangkuman kondisi cuaca terkininya 🌤️:\n\n${externalApiContext.replace(/\[DATA CUACA REAL-TIME\]:\s*/, '')}\n\nPastikan peralatan outdoor sudah siap ya kak! Ada yang perlu dicek lagi seputar gear?`;
      }
      return `Berikut informasi pemantauan cuaca dan keselamatan terkini:\n\n${externalApiContext.replace(/\[DATA CUACA REAL-TIME\]:\s*/, '')}\n\nMohon selalu utamakan keselamatan dan perlengkapan standar.`;
    }

    // Handle Frustrated / Escalation
    if (sentiment === 'FRUSTRATED') {
      if (tone === 'FORMAL' || tone === 'EMPATHETIC') {
        return `Kami memohon maaf yang sebesar-besarnya atas ketidaknyamanan yang ${customerSalutation} alami. Kami sangat memahami kekecewaan Anda.\n\nMasalah ini adalah prioritas utama kami. Kami telah menerbitkan tiket eskalasi khusus agar tim supervisor kami dapat segera menindaklanjuti secara langsung. Anda juga dapat menekan tombol "Hubungi Agen Manusia" kapan saja untuk tersambung dengan perwakilan resmi kami.`;
      }
      return `Aduh, mohon maaf banget ya ${customerSalutation} atas kendala yang bikin gak nyaman ini 🙏 Aku ngerti banget kekhawatiran kamu.\n\nJangan khawatir, aku udah buatin tiket penanganan prioritas di bawah. Tim kami bakal bantu tuntaskan sampai beres secepat mungkin!`;
    }

    // Domain-specific knowledge matching
    if (domain === 'HEALTH') {
      if (/dokter|jadwal|spesialis|praktek/i.test(textLower)) {
        if (tone === 'FORMAL') {
          return `Berikut adalah jadwal praktek dokter spesialis di Klinik MedikaCare Sejahtera:\n\n1. **dr. Sarah, Sp.A (Spesialis Anak)**:\n   - Hari: Senin, Rabu, Jumat\n   - Jam: 09.00 - 14.00 WIB\n\n2. **dr. Budi Santoso, Sp.PD (Spesialis Penyakit Dalam)**:\n   - Hari: Selasa, Kamis, Sabtu\n   - Jam: 13.00 - 18.00 WIB\n\n3. **drg. Anita Wijaya (Dokter Gigi & Mulut)**:\n   - Hari: Senin s/d Jumat\n   - Jam: 10.00 - 16.00 WIB\n\nApakah ${customerSalutation} ingin kami bantu proses pendaftaran atau nomor antrean?`;
        }
        return `Ini dia jadwal dokter kami ya ${customerSalutation} 🩺:\n\n• **dr. Sarah, Sp.A** (Anak) 👉 Sen, Rab, Jum (09.00-14.00)\n• **dr. Budi, Sp.PD** (Penyakit Dalam) 👉 Sel, Kam, Sab (13.00-18.00)\n• **drg. Anita** (Gigi) 👉 Senin-Jumat (10.00-16.00)\n\nMau langsung dibantu ambil nomor antrean sekarang?`;
      }

      if (/demam|panas|flu|batuk|gejala|pertolongan/i.test(textLower)) {
        return `Untuk pertolongan pertama pada keluhan demam atau gejala flu:\n\n1. **Kompres hangat** di area dahi atau lipatan ketiak (hindari kompres air dingin/es).\n2. **Pastikan hidrasi cukup** dengan minum air putih hangat berkala atau oralit jika disertai lemas.\n3. **Konsumsi obat penurun panas umum** seperti Paracetamol sesuai dosis anjuran berat badan/usia.\n4. **Catat suhu tubuh** secara berkala menggunakan termometer.\n\n⚠️ *Perhatian:* Segera bawa ke UGD MedikaCare kami jika demam melebihi 39°C, timbul kejang, sesak napas berat, atau pasien tampak sangat lemas. Kami siaga 24 jam.`;
      }

      if (/mcu|check up|medical check|biaya/i.test(textLower)) {
        return `Klinik MedikaCare menyediakan 3 pilihan paket Medical Check-Up:\n\n• **Paket Dasar (Rp 350.000)**: Hematologi lengkap, gula darah puasa, kolesterol total, asam urat, urine lengkap.\n• **Paket Eksekutif (Rp 750.000)**: Paket dasar + fungsi hati (SGOT/SGPT), fungsi ginjal (ureum/kreatinin), rontgen thorax & konsultasi dokter spesialis.\n• **Paket Kardiovaskular (Rp 1.200.000)**: Pemeriksaan lengkap + EKG jantung, Treadmill test, dan profil lipid menyeluruh.\n\nPersiapan: Puasa makan 8-10 jam sebelum pemeriksaan (tetap boleh minum air putih). Ingin kami reservasikan slotnya?`;
      }
    }

    if (domain === 'EDUCATION') {
      if (/pemula|non-it|latar belakang|bisa ikut/i.test(textLower)) {
        if (tone === 'CASUAL') {
          return `Bisa banget dong ${customerSalutation}! 🚀 Sekitar 68% alumni EduSphere berasal dari latar belakang non-IT (ekonomi, sastra, hukum, teknik sipil, hingga fresh graduate SMA/SMK).\n\nKurikulum kami dirancang mulai dari pondasi dasar (Foundations), logika pemrograman, sampai praktek studi kasus industri nyata. Ditambah ada sesi mentoring 1-on-1 setiap minggu biar kamu gak merasa tertinggal. Mau coba tes bakat coding gratis dulu?`;
        }
        return `Tentu saja, ${customerSalutation}. Program kami dirancang secara komprehensif bagi pemula tanpa latar belakang IT. Kami menyediakan materi pre-bootcamp persiapan dasar secara gratis, serta pendampingan mentor praktisi industri berpengalaman untuk memastikan setiap siswa memahami logika dan implementasi dari nol.`;
      }

      if (/beasiswa|biaya|cicilan|isa|diskon/i.test(textLower)) {
        return `Untuk skema biaya dan beasiswa di EduSphere Academy:\n\n1. **Program Beasiswa Talenta (Hingga 100%)**:\n   - Terbuka untuk bootcamp Fullstack & Data Science.\n   - Seleksi melalui tes logika online dan submission portofolio/esai motivasi.\n2. **Opsi Cicilan 0%**:\n   - Mulai dari Rp 708.000/bulan via partner perbankan atau fintech resmi berizin OJK.\n3. **Income Share Agreement (ISA)**:\n   - Belajar dulu, bayar setelah resmi bekerja dengan gaji di atas batas minimum industri.\n\nApakah Anda ingin memeriksa status aplikasi beasiswa atau menghitung simulasi cicilan?`;
      }

      if (/durasi|jam belajar|kurikulum|materi/i.test(textLower)) {
        return `Berikut rincian waktu belajar dan kurikulum:\n\n• **Bootcamp Fullstack Web** (16 Minggu): HTML/CSS, Modern JavaScript, React 19, Node.js/Express, PostgreSQL, Cloud Deployment.\n• **Bootcamp Data Science & AI** (14 Minggu): Python, Data Analysis (Pandas/Numpy), Machine Learning, LLM/Gemini Integration.\n\nJadwal Belajar: Live Class via Zoom setiap Senin, Rabu, Jumat pukul 19.00 - 21.30 WIB (rekaman kelas otomatis tersedia di portal LMS jika berhalangan hadir).`;
      }
    }

    if (domain === 'HOBBY') {
      if (/tenda|badai|stormproof|kapasitas/i.test(textLower)) {
        return `Untuk tenda pendakian berkualitas tinggi, kami sangat merekomendasikan **Apex 2P Stormproof**:\n\n• **Bobot Ultralight**: Hanya 1.45 kg (sangat nyaman dibawa di carrier).\n• **Ketahanan Cuaca**: Flysheet 20D Ripstop Silnylon dengan daya tahan air 4000mm (tahan hujan badai tropis).\n• **Frame**: DAC Featherlite Aluminium alloy yang kokoh namun elastis terhadap hembusan angin puncak.\n• **Fitur**: Double vestibul (teras) untuk memasak dan menaruh tas carrier.\n• **Garansi**: Garansi perbaikan frame seumur hidup dari GiriVentures!\n\nApakah ingin kami kirimkan tautan pemesanan atau ingin membandingkannya dengan seri 4 orang?`;
      }

      if (/carrier|tas|kapasitas 50l|60l|ransel/i.test(textLower)) {
        return `Untuk carrier, kami memiliki seri **Pathfinder 60+10L** dan **Apex Trail 50L**:\n\n• Jika perjalanan 2-3 hari: 50L sudah sangat cukup dan lincah.\n• Jika perjalanan 3-5 hari atau ekspedisi bersama: 60+10L sangat ideal karena ada kompartemen khusus sleeping bag di bagian bawah dan saku samping elastis untuk tenda/matras.\n• Keduanya sudah dilengkapi sistem backsystem ErgoVent anti-pegal dan gratis Raincover waterproof.\n\nBerapa tinggi badan ${customerSalutation} agar kami bisa rekomendasikan ukuran torso yang pas?`;
      }

      if (/garansi|klaim|rusak/i.test(textLower)) {
        return `Semua produk GiriVentures dilindungi **Garansi Seumur Hidup (Lifetime Warranty)** untuk:\n1. Kerusakan jahitan utama pada carrier dan tenda.\n2. Patahnya frame aluminium pada pemakaian normal.\n3. Kerusakan ritsleting (zipper) YKK.\n\nCara klaim: Cukup kirimkan foto kartu garansi / invoice pembelian dan foto bagian yang rusak ke layanan pelanggan kami. Kami akan jemput unit atau sediakan suku cadang pengganti gratis!`;
      }
    }

    if (domain === 'SAAS') {
      if (/502|error|down|gateway|server/i.test(textLower)) {
        return `Terkait error **502 Bad Gateway**, hal ini umumnya terjadi ketika web server (Nginx/Apache) tidak menerima respon dari backend process (Node.js, PHP-FPM, atau Python).\n\nLangkah pengecekan cepat:\n1. Periksa status proses backend: \`systemctl status [service-name]\`\n2. Cek apakah memori RAM server penuh (OOM Killer): jalankan \`free -m\`\n3. Periksa log error Nginx: \`tail -n 50 /var/log/nginx/error.log\`\n4. Restart service aplikasi: \`pm2 restart all\` atau \`systemctl restart app\`\n\nJika server masih tidak merespon, sebutkan IP atau ID server Anda agar tim NOC kami segera melakukan remote inspection.`;
      }

      if (/upgrade|ram|cpu|downtime/i.test(textLower)) {
        return `Di CloudScale, Anda dapat melakukan **Live Scaling (Hot Plug)** untuk vCPU dan RAM:\n\n• Proses upgrade hanya membutuhkan waktu kurang dari 30 detik tanpa perlu reinstall OS atau mematikan database.\n• Disk NVMe dapat diperbesar kapan saja melalui Cloud Dashboard pada menu *Volume Management*.\n• Biaya akan dihitung secara pro-rata per jam pemakaian (hourly billing) sehingga sangat hemat.\n\nApakah Anda memerlukan bantuan untuk panduan upgrade melalui dashboard?`;
      }
    }

    // Default polite response based on Tone
    if (tone === 'FORMAL') {
      return `Terima kasih atas pesan yang ${customerSalutation} sampaikan. Pertanyaan Anda mengenai hal tersebut telah kami catat dalam sistem layanan kami. Untuk memberikan solusi yang paling tepat, mohon sampaikan detail kebutuhan atau kode referensi yang ingin ditanyakan. Kami siap membantu secara menyeluruh.`;
    } else if (tone === 'CASUAL') {
      return `Siap ${customerSalutation}! Pertanyaan kamu udah aku catat nih 😊 Ada bagian spesifik yang mau kita bahas lebih detail? Kasih tahu aku aja, santai kita cari jalan keluarnya bareng-bareng!`;
    } else if (tone === 'CONCISE') {
      return `Pesan diterima. Silakan informasikan rincian spesifik yang diperlukan agar dapat kami proses segera.`;
    } else {
      return `Terima kasih telah berbagi dengan kami, ${customerSalutation}. Kami sangat menghargai waktu dan kepercayaan Anda. Kami ada di sini untuk mendengarkan serta memberikan solusi yang paling nyaman bagi Anda.`;
    }
  }
}
