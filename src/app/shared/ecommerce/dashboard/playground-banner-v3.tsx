// ============================================================================
// DUPLIKAT-V3: Voice Avatar Version
// Dibuat: 2025-12-18
// Deskripsi: Banner dengan voice - avatar TETAP DI KANAN, hanya membesar
// Update: Chat bubbles di kiri atas, chat input di kiri bawah, video saat aktif
// ============================================================================

'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PiMicrophoneFill, PiMicrophoneSlashFill, PiXBold, PiPaperPlaneRightFill } from 'react-icons/pi';
import cn from '@core/utils/class-names';

interface VoiceMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
}

export default function PlaygroundBannerV3({ className }: { className?: string }) {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<VoiceMessage[]>([
    { id: '1', text: 'Halo! Tekan mikrofon untuk berbicara.', sender: 'assistant' },
  ]);

  const handleStartListening = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: 'Halo, apa kabar?', sender: 'user' }]);
      setIsSpeaking(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: 'Saya baik! Ada yang bisa saya bantu?', sender: 'assistant' }]);
        setIsSpeaking(false);
      }, 2000);
    }, 2500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: inputValue.trim(), sender: 'user' }]);
    setInputValue('');
    
    // Simulate AI response
    setIsSpeaking(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: 'Terima kasih atas pesannya!', sender: 'assistant' }]);
      setIsSpeaking(false);
    }, 1500);
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
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
          {/* Close Button - kiri atas pojok */}
          <button
            onClick={() => setIsVoiceOpen(false)}
            className="absolute top-3 left-3 z-30 w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
          >
            <PiXBold className="size-3.5 text-white" />
          </button>

          {/* Chat Bubbles - simple dan clean */}
          <div className="absolute top-12 left-4 z-20 max-w-[200px]">
            <div className="space-y-2" style={{ scrollbarWidth: 'none' }}>
              {messages.slice(-3).map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'px-3 py-2 rounded-xl text-[11px] leading-snug',
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
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

          {/* Status indicator - tengah atas */}
          {(isListening || isSpeaking) && (
            <div className={cn(
              "absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-white text-xs font-medium flex items-center gap-2 z-20 shadow-lg backdrop-blur-sm",
              isListening ? "bg-blue-500/90" : "bg-green-500/90"
            )}>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span>{isListening ? 'Mendengarkan...' : 'Berbicara...'}</span>
            </div>
          )}
        </>
      )}

      {/* Avatar - TETAP DI KANAN dengan transisi smooth ke video */}
      <div className="absolute bottom-0 right-4 z-10">
        {isVoiceOpen && (
          <div className={cn(
            "absolute inset-0 rounded-full blur-3xl transition-all duration-500",
            isSpeaking && "bg-green-400/30 scale-150",
            isListening && "bg-blue-400/30 scale-150",
            !isSpeaking && !isListening && "bg-gray-400/10 scale-100"
          )} />
        )}
        
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
          
          {/* Video - fade in saat voice open */}
          <video
            src="/avatar-maya.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={cn(
              "absolute bottom-0 right-0 transition-all duration-700 ease-out object-contain",
              isVoiceOpen ? 'h-72 w-auto opacity-100 scale-100' : 'h-44 w-auto opacity-0 scale-95 pointer-events-none',
              isSpeaking && 'drop-shadow-[0_0_40px_rgba(34,197,94,0.7)] scale-110 brightness-105',
              isListening && 'drop-shadow-[0_0_40px_rgba(59,130,246,0.7)] scale-105 brightness-105'
            )}
            style={{
              filter: isSpeaking 
                ? 'drop-shadow(0 0 20px rgba(34,197,94,0.5)) drop-shadow(0 0 40px rgba(34,197,94,0.3))'
                : isListening 
                  ? 'drop-shadow(0 0 20px rgba(59,130,246,0.5)) drop-shadow(0 0 40px rgba(59,130,246,0.3))'
                  : undefined
            }}
          />
        </div>
        
        {isVoiceOpen && (isListening || isSpeaking) && (
          <>
            <div className={cn(
              "absolute bottom-8 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border-2 opacity-30 animate-ping",
              isListening ? 'border-blue-400' : 'border-green-400'
            )} />
            <div className={cn(
              "absolute bottom-4 left-1/2 -translate-x-1/2 w-52 h-52 rounded-full border-2 opacity-20 animate-ping",
              isListening ? 'border-blue-400' : 'border-green-400'
            )} style={{ animationDelay: '300ms', animationDuration: '1.5s' }} />
          </>
        )}
      </div>
    </div>
  );
}