/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  DomainType,
  ToneType,
  UserMemory,
  ChatMessage as ChatMessageType,
  SentimentType,
  CustomDomainConfig,
  BookingResult,
  RecommendationItem
} from './types';
import { DOMAINS, TONES } from './data/mockData';
import { AiChatService } from './services/aiService';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { EscalationModal } from './components/EscalationModal';
import { BookingModal } from './components/BookingModal';
import { ApiToolsModal } from './components/ApiToolsModal';
import { CustomDomainModal } from './components/CustomDomainModal';
import { Sparkles, Bot, ShieldAlert, HeartHandshake } from 'lucide-react';

const INITIAL_MEMORY: UserMemory = {
  userName: '',
  preferences: ['Bahasa Indonesia', 'Respon Cepat'],
  notes: []
};

export default function App() {
  const [currentDomain, setCurrentDomain] = useState<DomainType>('HEALTH');
  const [currentTone, setCurrentTone] = useState<ToneType>('CASUAL');
  const [memory, setMemory] = useState<UserMemory>(() => {
    try {
      const saved = localStorage.getItem('omnicare_user_memory');
      return saved ? JSON.parse(saved) : INITIAL_MEMORY;
    } catch {
      return INITIAL_MEMORY;
    }
  });

  const [sentiment, setSentiment] = useState<SentimentType>('NEUTRAL');
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Modals
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isApiToolsOpen, setIsApiToolsOpen] = useState(false);
  const [isCustomDomainOpen, setIsCustomDomainOpen] = useState(false);

  // Custom Domain Config
  const [customDomainConfig, setCustomDomainConfig] = useState<CustomDomainConfig>({
    companyName: 'Toko Kopi Aroma Senja',
    businessType: 'Kafe & Roastery Kopi Spesialti',
    knowledgeText: `Toko Kopi Aroma Senja:
- Buka setiap hari pukul 08.00 - 22.00 WIB.
- Menu Unggulan: Kopi Susu Senja (Rp 22.000), V60 Single Origin Gayo/Toraja (Rp 28.000), Croissant Almond (Rp 25.000).
- Fasilitas: WiFi 100 Mbps, colokan listrik di setiap meja, smoking area rooftop, musholla.
- Pembayaran: QRIS, GoPay, OVO, ShopeePay, Kartu Debit/Kredit (tanpa biaya admin).
- Promo: Diskon 15% setiap pembelian paket Kopi + Pastry sebelum jam 11 siang.`,
    faqs: []
  });

  // Recommendations
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(
    DOMAINS['HEALTH'].recommendations
  );

  // Chat Messages
  const [messages, setMessages] = useState<ChatMessageType[]>(() => {
    const welcome = DOMAINS['HEALTH'].welcomeMessage['CASUAL'];
    return [
      {
        id: 'msg-welcome-0',
        sender: 'bot',
        text: welcome,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        toneUsed: 'CASUAL'
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync memory to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('omnicare_user_memory', JSON.stringify(memory));
    } catch (e) {
      console.error(e);
    }
  }, [memory]);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Domain Switch
  const handleSelectDomain = (domain: DomainType) => {
    setCurrentDomain(domain);
    setRecommendations(DOMAINS[domain].recommendations);

    const welcome = DOMAINS[domain].welcomeMessage[currentTone];
    const systemNotice: ChatMessageType = {
      id: `sys-${Date.now()}`,
      sender: 'system',
      text: `Beralih ke Domain: ${DOMAINS[domain].name} (${DOMAINS[domain].agentName})`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    const welcomeMsg: ChatMessageType = {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: welcome,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      toneUsed: currentTone
    };

    setMessages(prev => [...prev, systemNotice, welcomeMsg]);
    setIsMobileSidebarOpen(false);
  };

  // Handle Tone Switch
  const handleSelectTone = (tone: ToneType) => {
    setCurrentTone(tone);
    const systemNotice: ChatMessageType = {
      id: `sys-tone-${Date.now()}`,
      sender: 'system',
      text: `Gaya bahasa Customer Service disesuaikan ke: ${TONES[tone].label}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, systemNotice]);
  };

  // Update Memory
  const handleUpdateMemory = (updated: Partial<UserMemory>) => {
    setMemory(prev => ({
      ...prev,
      ...updated,
      lastInteraction: new Date().toISOString()
    }));
  };

  const handleResetMemory = () => {
    setMemory({
      userName: '',
      preferences: [],
      notes: []
    });
    setMessages(prev => [
      ...prev,
      {
        id: `sys-reset-${Date.now()}`,
        sender: 'system',
        text: 'Memori interaksi pelanggan telah direset.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Send Message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userTimestamp = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const userMsg: ChatMessageType = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: userTimestamp
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build conversation payload
      const history = [...messages, userMsg]
        .filter(m => m.sender !== 'system')
        .map(m => ({
          role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text
        }));

      const response = await AiChatService.sendMessage({
        messages: history,
        domain: currentDomain,
        tone: currentTone,
        memory,
        customDomain: currentDomain === 'CUSTOM' ? customDomainConfig : undefined
      });

      // Update sentiment if detected
      if (response.sentiment) {
        setSentiment(response.sentiment);
      }

      // Update memory if AI extracted new info
      if (response.updatedMemory && Object.keys(response.updatedMemory).length > 0) {
        handleUpdateMemory(response.updatedMemory);
      }

      // Update recommendations if provided
      if (response.recommendations && response.recommendations.length > 0) {
        setRecommendations(response.recommendations);
      }

      const botTimestamp = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const botMsg: ChatMessageType = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        timestamp: botTimestamp,
        toneUsed: currentTone,
        sentimentDetected: response.sentiment,
        card: response.card
      };

      setMessages(prev => [...prev, botMsg]);

      // Audio Text-to-Speech if enabled
      if (ttsEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(response.reply);
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessageType = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: 'Mohon maaf, sistem sedang mengalami kendala jaringan sesaat. Silakan coba kembali.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        toneUsed: currentTone
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Export Chat
  const handleExportChat = () => {
    const transcript = messages
      .map(
        m =>
          `[${m.timestamp}] ${m.sender === 'bot' ? DOMAINS[currentDomain].agentName : m.sender === 'user' ? (memory.userName || 'Pengguna') : 'SISTEM'}: ${m.text}`
      )
      .join('\n\n');

    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Transkrip-CS-${currentDomain}-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Clear Chat
  const handleClearChat = () => {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat percakapan?')) {
      const welcome = DOMAINS[currentDomain].welcomeMessage[currentTone];
      setMessages([
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'bot',
          text: welcome,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          toneUsed: currentTone
        }
      ]);
      setSentiment('NEUTRAL');
    }
  };

  // Escalation submit
  const handleEscalationSubmit = (ticketData: {
    ticketId: string;
    customerName: string;
    contact: string;
    issue: string;
    priority: 'NORMAL' | 'HIGH' | 'URGENT';
  }) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [
      ...prev,
      {
        id: `esc-msg-${Date.now()}`,
        sender: 'bot',
        text: `Tiket Eskalasi Agen Manusia **#${ticketData.ticketId}** telah diterbitkan untuk ${ticketData.customerName}.\n\nPrioritas: **${ticketData.priority}**\nKontak: ${ticketData.contact}\nCatatan Masalah: "${ticketData.issue}"\n\nTim supervisor kami telah dialokasikan dan akan menghubungi Anda sesaat lagi.`,
        timestamp: timeStr,
        card: {
          type: 'ESCALATION',
          escalationTicketId: ticketData.ticketId
        }
      }
    ]);
    setSentiment('FRUSTRATED');
  };

  // Booking success
  const handleBookingSuccess = (booking: BookingResult) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [
      ...prev,
      {
        id: `bkg-msg-${Date.now()}`,
        sender: 'bot',
        text: `Reservasi berhasil dibuat! Konfirmasi janji temu dengan kode **#${booking.bookingId}** telah dicatat dalam agenda klinik/institusi kami.`,
        timestamp: timeStr,
        card: {
          type: 'BOOKING',
          bookingData: booking
        }
      }
    ]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Sidebar Navigation & Settings */}
      <Sidebar
        currentDomain={currentDomain}
        onSelectDomain={handleSelectDomain}
        currentTone={currentTone}
        onSelectTone={handleSelectTone}
        memory={memory}
        onUpdateMemory={handleUpdateMemory}
        onResetMemory={handleResetMemory}
        recommendations={recommendations}
        onSelectRecommendation={handleSendMessage}
        onOpenCustomDomainModal={() => setIsCustomDomainOpen(true)}
        onOpenBookingModal={() => setIsBookingOpen(true)}
        onOpenApiToolsModal={() => setIsApiToolsOpen(true)}
        customDomainConfig={customDomainConfig}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Backdrop for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Chat Workspace */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-slate-950 relative">
        {/* Header */}
        <ChatHeader
          currentDomain={currentDomain}
          currentTone={currentTone}
          sentiment={sentiment}
          ttsEnabled={ttsEnabled}
          onToggleTts={() => setTtsEnabled(!ttsEnabled)}
          onOpenEscalation={() => setIsEscalationOpen(true)}
          onExportChat={handleExportChat}
          onClearChat={handleClearChat}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          customDomainConfig={customDomainConfig}
        />

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-2">
          {/* Top Domain Information Banner */}
          <div className="mb-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                Domain Aktif: <strong className="text-white">{DOMAINS[currentDomain].name}</strong>
              </span>
              <span className="text-slate-600">|</span>
              <span>
                Gaya Bahasa: <strong className="text-amber-400">{TONES[currentTone].label}</strong>
              </span>
            </div>
            {memory.userName && (
              <span className="text-blue-400 font-medium hidden sm:inline">
                Pelanggan: {memory.userName}
              </span>
            )}
          </div>

          {messages.map(msg => (
            <ChatMessage
              key={msg.id}
              message={msg}
              currentDomain={currentDomain}
              onSelectRecommendation={handleSendMessage}
              onOpenBookingModal={() => setIsBookingOpen(true)}
              onOpenEscalationModal={() => setIsEscalationOpen(true)}
            />
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 my-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/10">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center gap-2 rounded-tl-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"
                    style={{ animationDelay: '200ms' }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"
                    style={{ animationDelay: '400ms' }}
                  ></span>
                </div>
                <span>
                  {DOMAINS[currentDomain].agentName} sedang menyusun jawaban...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          quickChips={DOMAINS[currentDomain].quickChips}
        />
      </main>

      {/* Modals */}
      <EscalationModal
        isOpen={isEscalationOpen}
        onClose={() => setIsEscalationOpen(false)}
        currentDomain={currentDomain}
        userName={memory.userName}
        onSubmitEscalation={handleEscalationSubmit}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        currentDomain={currentDomain}
        userName={memory.userName}
        onBookingSuccess={handleBookingSuccess}
      />

      <ApiToolsModal
        isOpen={isApiToolsOpen}
        onClose={() => setIsApiToolsOpen(false)}
        onSelectPrompt={handleSendMessage}
      />

      <CustomDomainModal
        isOpen={isCustomDomainOpen}
        onClose={() => setIsCustomDomainOpen(false)}
        initialConfig={customDomainConfig}
        onSaveConfig={cfg => {
          setCustomDomainConfig(cfg);
          setCurrentDomain('CUSTOM');
          handleSelectDomain('CUSTOM');
        }}
      />
    </div>
  );
}
