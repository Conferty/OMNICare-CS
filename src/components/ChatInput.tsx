import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, CornerDownLeft } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  quickChips: string[];
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  quickChips
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Setup Web Speech Recognition if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'id-ID';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Browser Anda belum mendukung input suara Web Speech API.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    onSendMessage(inputText.trim());
    setInputText('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Auto-resize textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800 backdrop-blur-md">
      {/* Quick FAQ Chips */}
      {quickChips.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2 no-scrollbar scroll-smooth">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Sparkles className="w-3 h-3 text-blue-400" /> Tanya Cepat:
          </span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(chip)}
              disabled={isLoading}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 hover:text-white shrink-0 transition whitespace-nowrap disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Main Input Box */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-2 focus-within:border-blue-500/80 transition-all shadow-inner"
      >
        {/* Voice Input */}
        <button
          type="button"
          onClick={handleToggleVoice}
          title={isListening ? 'Berhenti mendengarkan' : 'Bicara dengan Mikrofon'}
          className={`p-2 rounded-xl transition ${
            isListening
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pertanyaan Anda... (Enter untuk kirim, Shift+Enter untuk baris baru)"
          rows={1}
          disabled={isLoading}
          className="flex-1 bg-transparent text-slate-100 text-sm placeholder-slate-500 focus:outline-none resize-none py-1.5 px-1 max-h-32 leading-relaxed"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className={`p-2.5 rounded-xl font-medium transition flex items-center justify-center shrink-0 ${
            inputText.trim() && !isLoading
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>

      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 px-1">
        <span>Tekan Enter untuk kirim</span>
        <span>Customer Service Terintegrasi Real-time</span>
      </div>
    </div>
  );
};
