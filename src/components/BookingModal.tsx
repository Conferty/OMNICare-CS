import React, { useState } from 'react';
import { DomainType, BookingResult } from '../types';
import { DOMAINS } from '../data/mockData';
import { Calendar, Clock, MapPin, CheckCircle2, User } from 'lucide-react';
import { ExternalApiService } from '../services/apiService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDomain: DomainType;
  userName?: string;
  onBookingSuccess: (booking: BookingResult) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  currentDomain,
  userName = '',
  onBookingSuccess
}) => {
  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('2026-09-28');
  const [time, setTime] = useState('10:00 - 11:00 WIB');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const domain = DOMAINS[currentDomain];

  const getServiceOptions = () => {
    switch (currentDomain) {
      case 'HEALTH':
        return [
          'Pemeriksaan dr. Sarah Sp.A (Anak)',
          'Konsultasi dr. Budi Sp.PD (Penyakit Dalam)',
          'Pemeriksaan Gigi drg. Anita Wijaya',
          'Paket Medical Check-Up (MCU) Eksekutif',
          'Suntik Imun Booster Vitamin C & Zinc'
        ];
      case 'EDUCATION':
        return [
          'Konsultasi Karir & Placement Tech 1-on-1',
          'Trial Class & Silabus Review Fullstack',
          'Review Aplikasi Beasiswa 100%',
          'Sesi Mentoring Data Science & AI'
        ];
      case 'HOBBY':
        return [
          'Fitting & Penyesuaian Ukuran Carrier 60L',
          'Inspeksi & Klaim Garansi Tenda Apex',
          'Konsultasi Perlengkapan Ekspedisi Salju/Tropis'
        ];
      case 'SAAS':
        return [
          'Sesi Konsultasi Arsitektur Multi-Cloud',
          'Audit Keamanan & Setup Anti-DDoS',
          'Migrasi Database High-Availability'
        ];
      default:
        return ['Sesi Konsultasi Layanan Utama'];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const selectedService = service || getServiceOptions()[0];
      const result = await ExternalApiService.createBooking({
        userName: name || 'Pelanggan',
        domain: currentDomain,
        serviceName: selectedService,
        preferredDate: date,
        preferredTime: time
      });

      onBookingSuccess(result);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Booking Jadwal / Janji Temu</h3>
              <p className="text-xs text-slate-400">{domain.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Nama Pasien / Pemesan</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nama Lengkap"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">No. WhatsApp Konfirmasi</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="0812-xxxx-xxxx"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Pilihan Layanan / Dokter</label>
            <select
              value={service}
              onChange={e => setService(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
            >
              {getServiceOptions().map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Tanggal</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Slot Waktu</label>
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="09:00 - 10:00 WIB">09:00 - 10:00 WIB</option>
                <option value="10:00 - 11:00 WIB">10:00 - 11:00 WIB</option>
                <option value="13:30 - 14:30 WIB">13:30 - 14:30 WIB</option>
                <option value="15:00 - 16:00 WIB">15:00 - 16:00 WIB</option>
                <option value="19:00 - 20:00 WIB">19:00 - 20:00 WIB</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {isLoading ? 'Memproses...' : 'Konfirmasi Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
