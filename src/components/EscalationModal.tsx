import React, { useState } from 'react';
import { DomainType } from '../types';
import { DOMAINS } from '../data/mockData';
import { AlertCircle, UserCheck, CheckCircle2, ShieldAlert } from 'lucide-react';

interface EscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDomain: DomainType;
  userName?: string;
  onSubmitEscalation: (ticketData: {
    ticketId: string;
    customerName: string;
    contact: string;
    issue: string;
    priority: 'NORMAL' | 'HIGH' | 'URGENT';
  }) => void;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  isOpen,
  onClose,
  currentDomain,
  userName = '',
  onSubmitEscalation
}) => {
  const [name, setName] = useState(userName);
  const [contact, setContact] = useState('');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('HIGH');
  const [submitted, setSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = `ESC-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedTicketId(ticketId);
    onSubmitEscalation({
      ticketId,
      customerName: name || 'Pelanggan',
      contact: contact || '-',
      issue: issue || 'Permintaan bantuan eskalasi langsung ke agen manusia',
      priority
    });
    setSubmitted(true);
  };

  const handleDone = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Eskalasi ke Agen Manusia</h3>
              <p className="text-xs text-slate-400">{DOMAINS[currentDomain]?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Tiket Eskalasi Diterbitkan!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Nomor Tiket Anda:{' '}
                <strong className="text-emerald-400 font-mono text-sm">{generatedTicketId}</strong>
              </p>
              <p className="text-xs text-slate-300 mt-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                Agen manusia senior kami telah menerima rangkuman masalah Anda. Rata-rata respon agen prioritas adalah <strong>3-5 menit</strong>.
              </p>
            </div>
            <button
              onClick={handleDone}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
            >
              Kembali ke Percakapan
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">No. WhatsApp / Email</label>
              <input
                type="text"
                required
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="0812xxxx atau email@domain.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Tingkat Urgensi</label>
              <div className="grid grid-cols-3 gap-2">
                {(['NORMAL', 'HIGH', 'URGENT'] as const).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    className={`py-2 rounded-lg font-bold border transition text-[11px] ${
                      priority === lvl
                        ? lvl === 'URGENT'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : lvl === 'HIGH'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-blue-500/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {lvl === 'URGENT' ? '🚨 Mendesak' : lvl === 'HIGH' ? '⚠️ Penting' : 'Normal'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Ringkasan Kendala / Keluhan</label>
              <textarea
                rows={3}
                required
                value={issue}
                onChange={e => setIssue(e.target.value)}
                placeholder="Jelaskan kendala yang dialami agar supervisor dapat langsung memberikan solusi..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
              />
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
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition shadow-md shadow-rose-600/20"
              >
                Kirim Tiket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
