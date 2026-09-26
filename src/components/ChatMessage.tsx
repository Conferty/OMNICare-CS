import React, { useState } from 'react';
import { ChatMessage as ChatMessageType, DomainType, RecommendationItem } from '../types';
import { DOMAINS } from '../data/mockData';
import {
  User,
  Bot,
  Copy,
  Check,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  Truck,
  Calendar,
  AlertCircle,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  currentDomain: DomainType;
  onSelectRecommendation?: (prompt: string) => void;
  onOpenBookingModal?: () => void;
  onOpenEscalationModal?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  currentDomain,
  onSelectRecommendation,
  onOpenBookingModal,
  onOpenEscalationModal
}) => {
  const isBot = message.sender === 'bot';
  const isSystem = message.sender === 'system';
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const domain = DOMAINS[currentDomain];

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.text);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <div className="text-xs bg-slate-800/80 border border-slate-700/60 text-slate-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{message.text}</span>
        </div>
      </div>
    );
  }

  // Format message text (support bold **text**, bullet points •, code `code`)
  const renderFormattedText = (text: string) => {
    const paragraphs = text.split('\n');
    return paragraphs.map((para, pIdx) => {
      if (!para.trim()) return <div key={pIdx} className="h-2" />;

      // Parse bold **text** and `code`
      const parts = para.split(/(\*\*.*?\*\*|`.*?`)/g);

      const content = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 text-xs font-mono border border-slate-700"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      });

      if (para.trim().startsWith('•') || para.trim().startsWith('-')) {
        return (
          <div key={pIdx} className="flex items-start gap-2 my-1">
            <span className="text-blue-400 text-sm mt-0.5">•</span>
            <span className="flex-1">{content}</span>
          </div>
        );
      }

      return (
        <p key={pIdx} className="leading-relaxed mb-1.5 last:mb-0">
          {content}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 my-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {/* Bot Avatar */}
      {isBot && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/10 mt-1">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Message Body Container */}
      <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        {/* Author header */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-semibold text-slate-300">
            {isBot ? domain.agentName : 'Anda'}
          </span>
          <span className="text-[10px] text-slate-500">{message.timestamp}</span>
        </div>

        {/* Bubble */}
        <div
          className={`p-4 rounded-2xl text-sm shadow-sm transition-all ${
            isBot
              ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-sm shadow-blue-600/20'
          }`}
        >
          {renderFormattedText(message.text)}

          {/* Interactive Card: TRACKING */}
          {message.card?.type === 'TRACKING' && message.card.trackingData && (
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Pelacakan Sistem
                    </span>
                    <h5 className="font-semibold text-xs text-white">{message.card.trackingData.code}</h5>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {message.card.trackingData.status}
                </span>
              </div>

              <div className="text-xs space-y-1 mb-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <p className="text-slate-300">
                  <span className="text-slate-500">Judul/Item:</span> {message.card.trackingData.title}
                </p>
                {message.card.trackingData.courierOrAgent && (
                  <p className="text-slate-300">
                    <span className="text-slate-500">Petugas / Kurir:</span> {message.card.trackingData.courierOrAgent}
                  </p>
                )}
                {message.card.trackingData.estimatedDeliveryOrResponse && (
                  <p className="text-emerald-400 font-medium">
                    <span className="text-slate-500">Estimasi Tiba:</span>{' '}
                    {message.card.trackingData.estimatedDeliveryOrResponse}
                  </p>
                )}
              </div>

              {/* Timeline Steps */}
              <div className="space-y-2 pt-1 border-t border-slate-800/60">
                <p className="text-[11px] font-semibold text-slate-400">Riwayat Pergerakan:</p>
                {message.card.trackingData.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-[11px]">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span>{step.time}</span>
                        {step.location && <span className="text-slate-500">{step.location}</span>}
                      </div>
                      <p className="text-slate-200 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Card: BOOKING */}
          {message.card?.type === 'BOOKING' && message.card.bookingData && (
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-indigo-500/30 text-slate-200">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                      Konfirmasi Reservasi Janji Temu
                    </span>
                    <h5 className="font-semibold text-xs text-white">{message.card.bookingData.bookingId}</h5>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {message.card.bookingData.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Layanan:</span>
                  <span className="font-semibold text-white truncate block">{message.card.bookingData.serviceName}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Atas Nama:</span>
                  <span className="font-semibold text-white truncate block">{message.card.bookingData.patientOrStudentName}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Waktu:</span>
                  <span className="font-semibold text-emerald-400 block">{message.card.bookingData.date}, {message.card.bookingData.timeSlot}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Dokter/Konsultan:</span>
                  <span className="font-semibold text-white truncate block">{message.card.bookingData.doctorOrMentor}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80 text-slate-400">
                <span className="flex items-center gap-1 text-[11px]">
                  <MapPin className="w-3 h-3 text-indigo-400" />
                  {message.card.bookingData.locationOrLink}
                </span>
                <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Terjadwal
                </span>
              </div>
            </div>
          )}

          {/* Interactive Card: ESCALATION */}
          {message.card?.type === 'ESCALATION' && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <h5 className="font-semibold text-xs text-white">
                  Jalur Cepat Eskalasi Supervisor (Human Agent)
                </h5>
              </div>
              <p className="text-xs text-rose-300/90 mb-3">
                Kami mendeteksi kendala mendesak. Tiket prioritas telah dibuat:
                <strong className="text-white ml-1 font-mono">{message.card.escalationTicketId}</strong>. Tim supervisor kami siap mengambil alih percakapan ini.
              </p>
              <button
                onClick={onOpenEscalationModal}
                className="w-full text-xs font-semibold py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20"
              >
                Hubungkan dengan Agen Manusia Sekarang
              </button>
            </div>
          )}
        </div>

        {/* Action icons for bot response */}
        {isBot && (
          <div className="flex items-center gap-1 mt-1 text-slate-500 text-xs px-1">
            <button
              onClick={handleCopy}
              title="Salin Pesan"
              className="p-1 rounded hover:text-slate-300 hover:bg-slate-800 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleSpeak}
              title="Dengarkan Suara (Audio TTS)"
              className="p-1 rounded hover:text-slate-300 hover:bg-slate-800 transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3 bg-slate-800 mx-1"></div>
            <button
              onClick={() => setLiked(liked === true ? null : true)}
              title="Jawaban Membantu"
              className={`p-1 rounded transition ${liked === true ? 'text-blue-400 bg-blue-500/10' : 'hover:text-slate-300 hover:bg-slate-800'}`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLiked(liked === false ? null : false)}
              title="Jawaban Kurang Sesuai"
              className={`p-1 rounded transition ${liked === false ? 'text-rose-400 bg-rose-500/10' : 'hover:text-slate-300 hover:bg-slate-800'}`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isBot && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
