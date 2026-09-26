import React, { useState } from 'react';
import { DomainType, TrackingResult, WeatherResult } from '../types';
import { ExternalApiService } from '../services/apiService';
import { MOCK_TRACKING_DATABASE, MOCK_WEATHER_DATABASE } from '../data/mockData';
import { Truck, CloudRain, Search, ArrowRight, ExternalLink, CheckCircle } from 'lucide-react';

interface ApiToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const ApiToolsModal: React.FC<ApiToolsModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt
}) => {
  const [activeTab, setActiveTab] = useState<'TRACKING' | 'WEATHER'>('TRACKING');
  const [trackingInput, setTrackingInput] = useState('RESI-GRV-8821');
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [weatherInput, setWeatherInput] = useState('Gunung Gede');
  const [weatherResult, setWeatherResult] = useState<WeatherResult | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleTestTracking = async (codeToTest?: string) => {
    const code = codeToTest || trackingInput;
    setLoading(true);
    const res = await ExternalApiService.trackStatus(code);
    setTrackingResult(res);
    setLoading(false);
  };

  const handleTestWeather = async (locToTest?: string) => {
    const loc = locToTest || weatherInput;
    setLoading(true);
    const res = await ExternalApiService.checkWeather(loc);
    setWeatherResult(res);
    setLoading(false);
  };

  const handleAskBot = (prompt: string) => {
    onSelectPrompt(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-white">Panel Integrasi API Eksternal</h3>
            <p className="text-xs text-slate-400">
              Uji coba konektivitas sistem tracking logistik, tiket CS, dan cuaca real-time
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('TRACKING')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'TRACKING'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            Tracking Resi / Tiket / Invoice
          </button>
          <button
            onClick={() => setActiveTab('WEATHER')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'WEATHER'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            Live Weather & Mountain Telemetry
          </button>
        </div>

        {/* Tab 1: Tracking */}
        {activeTab === 'TRACKING' && (
          <div className="p-4 space-y-4 text-xs">
            <div>
              <p className="text-slate-400 mb-2">
                Pilih atau masukkan kode resi / nomor tiket kendala / invoice:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackingInput}
                  onChange={e => setTrackingInput(e.target.value)}
                  placeholder="Contoh: RESI-GRV-8821 atau TKT-1049"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleTestTracking()}
                  disabled={loading}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Cek...' : 'Uji API'}
                </button>
              </div>

              {/* Sample Quick Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] text-slate-500 py-1">Kode Sampel:</span>
                {Object.keys(MOCK_TRACKING_DATABASE).map(code => (
                  <button
                    key={code}
                    onClick={() => {
                      setTrackingInput(code);
                      handleTestTracking(code);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 font-mono text-[11px] border border-slate-700"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Tracking Result Display */}
            {trackingResult && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-mono text-xs font-bold text-white">{trackingResult.code}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {trackingResult.status}
                  </span>
                </div>
                <p className="text-slate-300">
                  <strong className="text-slate-400">Judul:</strong> {trackingResult.title}
                </p>
                {trackingResult.courierOrAgent && (
                  <p className="text-slate-300">
                    <strong className="text-slate-400">Petugas/Kurir:</strong> {trackingResult.courierOrAgent}
                  </p>
                )}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleAskBot(`Tolong cek status terkini ${trackingResult.code}`)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    Tanyakan ke Chatbot Sekarang <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Weather */}
        {activeTab === 'WEATHER' && (
          <div className="p-4 space-y-4 text-xs">
            <div>
              <p className="text-slate-400 mb-2">Pilih destinasi gunung atau kota tujuan:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={weatherInput}
                  onChange={e => setWeatherInput(e.target.value)}
                  placeholder="Contoh: Gunung Gede, Merbabu, Bromo"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleTestWeather()}
                  disabled={loading}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Cek...' : 'Uji API'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] text-slate-500 py-1">Lokasi Cepat:</span>
                {['Gunung Gede', 'Gunung Merbabu', 'Gunung Bromo', 'Jakarta'].map(loc => (
                  <button
                    key={loc}
                    onClick={() => {
                      setWeatherInput(loc);
                      handleTestWeather(loc);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] border border-slate-700"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {weatherResult && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="font-bold text-white text-xs">{weatherResult.location}</h4>
                  <span className="text-amber-400 font-bold">{weatherResult.temperature}</span>
                </div>
                <p className="text-slate-300">
                  <span className="text-slate-400">Kondisi:</span> {weatherResult.condition}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Kecepatan Angin:</span> {weatherResult.windSpeed} |{' '}
                  <span className="text-slate-400">Kelembaban:</span> {weatherResult.humidity}
                </p>
                <p className="text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-amber-400 font-medium">Saran Keselamatan:</span>{' '}
                  {weatherResult.hikingAdvice}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() =>
                      handleAskBot(
                        `Bagaimana info cuaca di ${weatherResult.location} dan apa saran perlengkapannya?`
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    Tanyakan ke Chatbot Sekarang <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};
