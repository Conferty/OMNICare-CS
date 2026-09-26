import React from 'react';
import { DomainType, ToneType, SentimentType, CustomDomainConfig } from '../types';
import { DOMAINS, TONES } from '../data/mockData';
import {
  Menu,
  Volume2,
  VolumeX,
  UserCheck,
  Download,
  Trash2,
  HeartPulse,
  GraduationCap,
  Compass,
  Server,
  Settings,
  ShieldAlert,
  Smile,
  Meh,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';

interface ChatHeaderProps {
  currentDomain: DomainType;
  currentTone: ToneType;
  sentiment: SentimentType;
  ttsEnabled: boolean;
  onToggleTts: () => void;
  onOpenEscalation: () => void;
  onExportChat: () => void;
  onClearChat: () => void;
  onOpenMobileMenu: () => void;
  customDomainConfig?: CustomDomainConfig;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentDomain,
  currentTone,
  sentiment,
  ttsEnabled,
  onToggleTts,
  onOpenEscalation,
  onExportChat,
  onClearChat,
  onOpenMobileMenu,
  customDomainConfig
}) => {
  const domain = DOMAINS[currentDomain];
  const tone = TONES[currentTone];

  const getDomainIcon = () => {
    switch (currentDomain) {
      case 'HEALTH':
        return <HeartPulse className="w-5 h-5 text-emerald-400" />;
      case 'EDUCATION':
        return <GraduationCap className="w-5 h-5 text-indigo-400" />;
      case 'HOBBY':
        return <Compass className="w-5 h-5 text-amber-400" />;
      case 'SAAS':
        return <Server className="w-5 h-5 text-cyan-400" />;
      case 'CUSTOM':
        return <Settings className="w-5 h-5 text-violet-400" />;
    }
  };

  const getSentimentBadge = () => {
    switch (sentiment) {
      case 'POSITIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Smile className="w-3 h-3" /> Sentimen: Puas / Positif
          </span>
        );
      case 'FRUSTRATED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            <AlertTriangle className="w-3 h-3" /> Sentimen: Keluhan / Perlu Bantuan
          </span>
        );
      case 'CURIOUS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <HelpCircle className="w-3 h-3" /> Sentimen: Ingin Tahu
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
            <Meh className="w-3 h-3" /> Sentimen: Netral
          </span>
        );
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between z-10 shrink-0">
      {/* Left: Mobile trigger & Domain Identity */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-sm">
          {getDomainIcon()}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-white truncate">
              {currentDomain === 'CUSTOM' && customDomainConfig?.companyName
                ? customDomainConfig.companyName
                : domain.name}
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
              Gaya: {tone.label}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              CS Online
            </span>
            <span className="text-slate-600">•</span>
            <span className="truncate hidden sm:inline">{domain.agentName}</span>
          </div>
        </div>
      </div>

      {/* Center/Right: Sentiment Meter & Actions */}
      <div className="flex items-center gap-2">
        <div className="hidden lg:block">{getSentimentBadge()}</div>

        {/* TTS Toggle */}
        <button
          onClick={onToggleTts}
          title={ttsEnabled ? 'Matikan Suara Bot (TTS)' : 'Nyalakan Suara Bot (TTS)'}
          className={`p-2 rounded-lg border transition ${
            ttsEnabled
              ? 'bg-blue-600/20 border-blue-500 text-blue-400'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Escalation Button */}
        <button
          onClick={onOpenEscalation}
          title="Eskalasi ke Agen Manusia / Supervisor"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition shadow-sm"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Hubungi Manusia</span>
        </button>

        {/* Export Chat */}
        <button
          onClick={onExportChat}
          title="Unduh Log Transkrip Percakapan"
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Clear Chat */}
        <button
          onClick={onClearChat}
          title="Bersihkan Percakapan"
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
