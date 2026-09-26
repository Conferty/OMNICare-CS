import React, { useState } from 'react';
import {
  DomainType,
  ToneType,
  UserMemory,
  RecommendationItem,
  CustomDomainConfig
} from '../types';
import { DOMAINS, TONES } from '../data/mockData';
import {
  HeartPulse,
  GraduationCap,
  Compass,
  Server,
  Settings,
  Brain,
  Sparkles,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  User,
  Tag,
  Wrench,
  CheckCircle2,
  Calendar,
  Truck
} from 'lucide-react';

interface SidebarProps {
  currentDomain: DomainType;
  onSelectDomain: (domain: DomainType) => void;
  currentTone: ToneType;
  onSelectTone: (tone: ToneType) => void;
  memory: UserMemory;
  onUpdateMemory: (updated: Partial<UserMemory>) => void;
  onResetMemory: () => void;
  recommendations: RecommendationItem[];
  onSelectRecommendation: (prompt: string) => void;
  onOpenCustomDomainModal: () => void;
  onOpenBookingModal: () => void;
  onOpenApiToolsModal: () => void;
  customDomainConfig?: CustomDomainConfig;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentDomain,
  onSelectDomain,
  currentTone,
  onSelectTone,
  memory,
  onUpdateMemory,
  onResetMemory,
  recommendations,
  onSelectRecommendation,
  onOpenCustomDomainModal,
  onOpenBookingModal,
  onOpenApiToolsModal,
  customDomainConfig,
  isOpenMobile,
  onCloseMobile
}) => {
  const [isEditingMemory, setIsEditingMemory] = useState(false);
  const [tempName, setTempName] = useState(memory.userName);
  const [newPrefInput, setNewPrefInput] = useState('');
  const [expandedSection, setExpandedSection] = useState<'domain' | 'tone' | 'memory' | 'rec' | null>('domain');

  const getDomainIcon = (id: DomainType) => {
    switch (id) {
      case 'HEALTH':
        return <HeartPulse className="w-5 h-5 text-emerald-500" />;
      case 'EDUCATION':
        return <GraduationCap className="w-5 h-5 text-indigo-500" />;
      case 'HOBBY':
        return <Compass className="w-5 h-5 text-amber-500" />;
      case 'SAAS':
        return <Server className="w-5 h-5 text-cyan-500" />;
      case 'CUSTOM':
        return <Settings className="w-5 h-5 text-violet-500" />;
    }
  };

  const handleSaveMemory = () => {
    onUpdateMemory({ userName: tempName.trim() });
    setIsEditingMemory(false);
  };

  const handleAddPreference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrefInput.trim()) return;
    const updated = [...memory.preferences, newPrefInput.trim()];
    onUpdateMemory({ preferences: updated });
    setNewPrefInput('');
  };

  const handleRemovePreference = (index: number) => {
    const updated = memory.preferences.filter((_, i) => i !== index);
    onUpdateMemory({ preferences: updated });
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-80 md:w-88 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 md:relative md:translate-x-0 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              OmniCare CS
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PRO AI
              </span>
            </h1>
            <p className="text-xs text-slate-400">Smart Multi-Domain Support</p>
          </div>
        </div>
        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            ✕
          </button>
        )}
      </div>

      {/* Scrollable Settings Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-sm">
        {/* SECTION 1: DOMAIN PENGETAHUAN */}
        <div className="bg-slate-850/60 rounded-xl border border-slate-800/80 p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Domain Pengetahuan
            </span>
            {currentDomain === 'CUSTOM' && (
              <button
                onClick={onOpenCustomDomainModal}
                className="text-[11px] text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1"
              >
                <Settings className="w-3 h-3" /> Edit FAQ
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {(Object.keys(DOMAINS) as DomainType[]).map(domainKey => {
              const dom = DOMAINS[domainKey];
              const isSelected = currentDomain === domainKey;
              return (
                <button
                  key={domainKey}
                  onClick={() => {
                    onSelectDomain(domainKey);
                    if (domainKey === 'CUSTOM' && !customDomainConfig?.companyName) {
                      onOpenCustomDomainModal();
                    }
                  }}
                  className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-2.5 border ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="p-1.5 rounded-md bg-slate-800/90 border border-slate-700/60 shrink-0 mt-0.5">
                    {getDomainIcon(domainKey)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-xs text-white truncate">
                        {domainKey === 'CUSTOM' && customDomainConfig?.companyName
                          ? customDomainConfig.companyName
                          : dom.name}
                      </span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {domainKey === 'CUSTOM' && customDomainConfig?.businessType
                        ? customDomainConfig.businessType
                        : dom.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: GAYA BAHASA (TONE OF VOICE) */}
        <div className="bg-slate-850/60 rounded-xl border border-slate-800/80 p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Gaya Bahasa (Tone)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(TONES) as ToneType[]).map(toneKey => {
              const tone = TONES[toneKey];
              const isSelected = currentTone === toneKey;
              return (
                <button
                  key={toneKey}
                  onClick={() => onSelectTone(toneKey)}
                  className={`p-2 rounded-lg text-left transition-all border ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500/80 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <p className="font-semibold text-xs truncate">{tone.label}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{tone.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: CUSTOMER MEMORY PROFILE */}
        <div className="bg-slate-850/60 rounded-xl border border-slate-800/80 p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-pink-400" />
              Memory Pelanggan
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditingMemory(!isEditingMemory)}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
              >
                {isEditingMemory ? 'Batal' : 'Edit'}
              </button>
              <button
                onClick={onResetMemory}
                title="Reset Memori Percakapan"
                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* User Name */}
          {isEditingMemory ? (
            <div className="space-y-2 mb-3">
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                placeholder="Nama Pelanggan (misal: Budi)"
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSaveMemory}
                className="w-full text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium py-1 rounded-lg transition"
              >
                Simpan Profil
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 mb-2.5">
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs">
                {memory.userName ? memory.userName.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">
                  {memory.userName ? memory.userName : 'Tamu (Belum Terdaftar)'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {memory.userName ? 'Pelanggan Teridentifikasi' : 'AI akan menyapa saat nama diucapkan'}
                </p>
              </div>
            </div>
          )}

          {/* Memory Tags / Preferences */}
          <div className="space-y-1.5">
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" /> Preferensi & Catatan AI:
            </p>
            {memory.preferences.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic p-2 rounded bg-slate-900/40 border border-slate-800/40">
                Belum ada preferensi. AI otomatis mencatat hal penting dari chat (alergi, budget, minat).
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {memory.preferences.map((pref, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/80"
                  >
                    {pref}
                    <button
                      onClick={() => handleRemovePreference(idx)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Quick add preference */}
            <form onSubmit={handleAddPreference} className="flex gap-1.5 mt-2">
              <input
                type="text"
                value={newPrefInput}
                onChange={e => setNewPrefInput(e.target.value)}
                placeholder="+ Tambah preferensi manual"
                className="flex-1 text-[11px] bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-slate-600"
              />
              <button
                type="submit"
                className="px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
              >
                +
              </button>
            </form>
          </div>
        </div>

        {/* SECTION 4: SMART RECOMMENDATIONS */}
        <div className="bg-slate-850/60 rounded-xl border border-slate-800/80 p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Rekomendasi Cerdas
            </span>
            <span className="text-[10px] text-slate-500">Live AI</span>
          </div>

          <div className="space-y-2">
            {recommendations.slice(0, 3).map(item => (
              <div
                key={item.id}
                className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h4 className="font-semibold text-xs text-white group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 whitespace-nowrap">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{item.description}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                  {item.price && <span className="text-xs font-bold text-emerald-400">{item.price}</span>}
                  <button
                    onClick={() => onSelectRecommendation(item.promptToAsk)}
                    className="ml-auto text-[11px] font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:underline"
                  >
                    Tanyakan ke Bot <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: EXTERNAL API TOOLS QUICK LAUNCH */}
        <div className="bg-slate-850/60 rounded-xl border border-slate-800/80 p-3.5 shadow-sm space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            Integrasi API & Tools
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onOpenApiToolsModal}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-left transition flex items-center gap-1.5 text-xs text-slate-300"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Cek Resi / Tiket</span>
            </button>
            <button
              onClick={onOpenBookingModal}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-left transition flex items-center gap-1.5 text-xs text-slate-300"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">Booking Temu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Engine: Gemini 2.5 Flash</span>
        </div>
        <span className="text-slate-500">v2.4 Pro</span>
      </div>
    </aside>
  );
};
