import { TrackingResult, WeatherResult, BookingResult, DomainType, RecommendationItem } from '../types';
import { MOCK_TRACKING_DATABASE, MOCK_WEATHER_DATABASE, DOMAINS } from '../data/mockData';

export class ExternalApiService {
  /**
   * Cek status resi pesanan, tiket kendala, atau invoice
   */
  static async trackStatus(codeRaw: string): Promise<TrackingResult | null> {
    const cleaned = codeRaw.trim().toUpperCase();

    // Check direct match
    if (MOCK_TRACKING_DATABASE[cleaned]) {
      return MOCK_TRACKING_DATABASE[cleaned];
    }

    // Try finding by partial code
    for (const [key, val] of Object.entries(MOCK_TRACKING_DATABASE)) {
      if (cleaned.includes(key) || key.includes(cleaned)) {
        return val;
      }
    }

    // Generate dynamic tracking result for any code provided by user
    if (cleaned.startsWith('RESI') || cleaned.startsWith('INV') || cleaned.startsWith('TKT') || cleaned.startsWith('POLI') || cleaned.startsWith('BEA')) {
      const type = cleaned.startsWith('RESI')
        ? 'ORDER'
        : cleaned.startsWith('TKT')
        ? 'TICKET'
        : cleaned.startsWith('INV')
        ? 'INVOICE'
        : cleaned.startsWith('POLI')
        ? 'BOOKING'
        : 'TICKET';

      return {
        code: cleaned,
        type,
        title: `Pelacakan Sistem: ${cleaned}`,
        status: 'Sedang Diproses oleh Sistem Pusat',
        courierOrAgent: 'Tim Layanan Pelanggan Otomatis',
        estimatedDeliveryOrResponse: 'Dalam 1-2 jam kerja',
        timeline: [
          {
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            description: `Permintaan informasi untuk kode ${cleaned} berhasil diverifikasi di database pusat.`,
            location: 'Sistem Terintegrasi',
            completed: true
          },
          {
            time: '1 jam yang lalu',
            description: 'Item dalam penanganan antrean prioritas tim operasional.',
            location: 'Hub Pusat',
            completed: true
          }
        ]
      };
    }

    return null;
  }

  /**
   * Cek info cuaca jalur pendakian / kota
   */
  static async checkWeather(locationQuery: string): Promise<WeatherResult> {
    const query = locationQuery.toLowerCase();

    if (query.includes('gede') || query.includes('cibodas') || query.includes('pangrango')) {
      return MOCK_WEATHER_DATABASE['gede'];
    }
    if (query.includes('merbabu') || query.includes('selo') || query.includes('boyolali')) {
      return MOCK_WEATHER_DATABASE['merbabu'];
    }
    if (query.includes('bromo') || query.includes('semeru') || query.includes('malang')) {
      return MOCK_WEATHER_DATABASE['bromo'];
    }

    return {
      location: locationQuery.toUpperCase(),
      temperature: '26°C - 30°C',
      condition: 'Kondisi Cuaca Normal, Kecepatan Angin Stabil',
      humidity: '76%',
      windSpeed: '14 km/jam',
      hikingAdvice: 'Cuaca kondusif untuk aktivitas luar ruangan. Selalu siapkan pakaian cadangan dan pelindung hujan.'
    };
  }

  /**
   * Booking janji temu dokter / demo kelas / servis gear
   */
  static async createBooking(params: {
    userName: string;
    domain: DomainType;
    serviceName: string;
    preferredDate: string;
    preferredTime: string;
    notes?: string;
  }): Promise<BookingResult> {
    const bookingId = `BK-${Date.now().toString().slice(-6)}`;
    
    let doctorOrMentor = 'Petugas Layanan Ahli';
    let locationOrLink = 'Cabang Utama';

    if (params.domain === 'HEALTH') {
      doctorOrMentor = 'dr. Sarah Sp.A / dr. Budi Santoso Sp.PD';
      locationOrLink = 'Klinik MedikaCare Sejahtera - Poli Rawat Jalan Lt. 2';
    } else if (params.domain === 'EDUCATION') {
      doctorOrMentor = 'Kak Maya (Academic & Career Counselor)';
      locationOrLink = 'Google Meet (Link dikirimkan via Email/WhatsApp)';
    } else if (params.domain === 'HOBBY') {
      doctorOrMentor = 'Bro Danu (Certified Gear Specialist)';
      locationOrLink = 'Showroom GiriVentures Flagship Store';
    } else if (params.domain === 'SAAS') {
      doctorOrMentor = 'Senior Solutions Architect';
      locationOrLink = 'Sesi Teleconference Private Cloud Consultation';
    }

    return {
      bookingId,
      patientOrStudentName: params.userName || 'Pelanggan Terhormat',
      serviceName: params.serviceName,
      date: params.preferredDate || 'Besok',
      timeSlot: params.preferredTime || '10:00 - 11:00 WIB',
      doctorOrMentor,
      status: 'CONFIRMED',
      locationOrLink
    };
  }

  /**
   * Rekomendasi berdasarkan domain dan kata kunci
   */
  static getRecommendations(domain: DomainType, query?: string): RecommendationItem[] {
    const items = DOMAINS[domain]?.recommendations || [];
    if (!query) return items;

    const q = query.toLowerCase();
    const filtered = items.filter(
      item => item.title.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q) ||
              item.category.toLowerCase().includes(q)
    );

    return filtered.length > 0 ? filtered : items;
  }
}
