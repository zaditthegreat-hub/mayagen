// ============================================================================
// DUPLIKAT-V3: Voice Avatar Version
// Dibuat: 2025-12-18
// Deskripsi: Banner dengan voice - avatar TETAP DI KANAN, hanya membesar
// Update: Chat bubbles di kiri atas, chat input di kiri bawah, video saat aktif
// ============================================================================

'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { PiMicrophoneFill, PiMicrophoneSlashFill, PiPaperPlaneRightFill } from 'react-icons/pi';
import cn from '@core/utils/class-names';

interface VoiceMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
}

export default function PlaygroundBannerV3({ className }: { className?: string }) {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<VoiceMessage[]>([
    { id: '1', text: 'Halo! Tekan mikrofon untuk berbicara.', sender: 'assistant' },
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartListening = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: 'Halo, apa kabar?', sender: 'user' }]);
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: 'Saya baik! Ada yang bisa saya bantu?', sender: 'assistant' }]);
      }, 2000);
    }, 2500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: inputValue.trim(), sender: 'user' }]);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: 'Terima kasih atas pesannya!', sender: 'assistant' }]);
    }, 1500);
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl bg-[#e3e3e3] dark:bg-gray-800",
      "min-h-[300px]",
      className
    )}>
      
      {/* Mode Normal */}
      {!isVoiceOpen && (
        <div className="max-w-md p-8 space-y-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">Playground Preview</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coba Dan Uji Persona AI.</h1>
          <p className="text-sm text-gray-700 dark:text-gray-300">Berbicara langsung dengan AI menggunakan suara Anda.</p>
          <button 
            onClick={() => setIsVoiceOpen(true)}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 font-medium transition-colors"
          >
            <PiMicrophoneFill className="w-5 h-5" />
            <span>Mulai Voice Chat</span>
          </button>
        </div>
      )}

      {/* Mode Voice Active */}
      {isVoiceOpen && (
        <>
          {/* Close Button - kiri atas */}
          <button
            onClick={() => setIsVoiceOpen(false)}
            className="absolute top-3 left-3 z-30 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white border border-gray-200 text-gray-600 hover:text-gray-800 text-[10px] font-medium transition-all shadow-sm"
          >
            ← Kembali
          </button>

          {/* Chat Bubbles - dengan scroll */}
          <div ref={chatContainerRef} className="absolute top-12 left-4 z-20 max-w-[200px] max-h-[180px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            <div className="space-y-2 pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'text-[11px] leading-snug py-1',
                    msg.sender === 'user'
                      ? 'text-blue-600 font-medium text-right'
                      : 'text-gray-600'
                  )}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input - kiri bawah dengan mic di kanan send */}
          <div className="absolute bottom-4 left-4 z-30 flex items-center gap-1.5 bg-white rounded-full shadow-md px-2.5 py-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ketik pesan..."
              className="w-28 text-[10px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 bg-transparent border-0 py-1"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none shadow-sm"
            >
              <PiPaperPlaneRightFill className="size-2.5" />
            </button>
            <button
              onClick={isListening ? () => setIsListening(false) : handleStartListening}
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center transition-all focus:outline-none shadow-sm",
                isListening 
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-500"
              )}
            >
              {isListening ? (
                <PiMicrophoneSlashFill className="size-2.5" />
              ) : (
                <PiMicrophoneFill className="size-2.5" />
              )}
            </button>
          </div>

          {/* Status indicator - di bawah kiri dekat input */}
          {isListening && (
            <div className="absolute bottom-16 left-4 z-20 flex items-center gap-2 text-blue-600 text-[10px] font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Mendengarkan...</span>
            </div>
          )}
        </>
      )}

      {/* Avatar - TETAP DI KANAN dengan transisi smooth ke video */}
      <div className="absolute -bottom-4 right-4 z-10">

        
        {/* Container untuk smooth transition antara image dan video */}
        <div className="relative">
          {/* Static Image - fade out saat voice open */}
          <Image
            src="/maya.webp"
            alt="AI Avatar"
            width={666}
            height={720}
            priority
            className={cn(
              "relative transition-all duration-700 ease-out object-contain",
              isVoiceOpen ? 'h-72 w-auto opacity-0 scale-105' : 'h-44 w-auto opacity-100 scale-100'
            )}
          />
          
          {/* Video - tanpa animasi scale */}
          <video
            src="/avatar-maya.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={cn(
              "absolute bottom-0 right-0 transition-all duration-500 ease-out object-contain",
              isVoiceOpen ? 'h-72 w-auto opacity-100' : 'h-44 w-auto opacity-0 scale-95 pointer-events-none'
            )}
          />
        </div>
      </div>
    </div>
  );
}