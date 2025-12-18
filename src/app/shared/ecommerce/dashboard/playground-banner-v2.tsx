// ============================================================================
// DUPLIKAT-V2: Text Chatbot Version
// File ini adalah duplikat dari playground-banner.tsx
// Dibuat: 2025-12-18
// Deskripsi: Banner dengan chat TRANSPARAN dan input di kanan bawah
// Untuk menghapus: Hapus file ini dan referensinya di create-edit-persona-v2.tsx
// ============================================================================

'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { PiChatCircleDotsFill, PiPaperPlaneRightFill } from 'react-icons/pi';
import { Box } from 'rizzui/box';
import { Button } from 'rizzui/button';
import { Flex } from 'rizzui/flex';
import { Text, Title } from 'rizzui/typography';
import cn from '@core/utils/class-names';

// DUPLIKAT-V2: Interface untuk chat messages
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
}

export default function PlaygroundBannerV2({ className }: { className?: string }) {
  // DUPLIKAT-V2: State untuk chatbot
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: 'Halo! Ada yang bisa saya bantu?', sender: 'assistant' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: inputValue, sender: 'user' }]);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: 'Terima kasih! Ini respons AI.', sender: 'assistant' }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <Flex
      justify="between"
      align="center"
      className={cn(
        'relative z-[1] overflow-hidden rounded-xl bg-[linear-gradient(268.48deg,#E3E4E6_0%,#F1F1F1_94.14%)] @container dark:bg-[linear-gradient(#181818,#181818)]',
        className
      )}
    >
      {/* Konten Banner - invisible saat chat aktif */}
      <Box className={cn(
        "max-w-[390px] space-y-3 p-5 py-7 @md:py-10 @2xl:max-w-[420px] @2xl:px-7 @3xl:max-w-[510px] @4xl:max-w-[580px] @4xl:pl-10 @5xl:max-w-[620px] @5xl:pl-14 @7xl:max-w-[700px] @7xl:pl-20",
        isChatOpen && "invisible"
      )}>
        <Text className="text-xs text-gray-900 @7xl:text-lg">Playground Preview</Text>
        <Title as="h1" className="font-inter text-2xl font-semibold capitalize !leading-normal @3xl:text-3xl @5xl:text-4xl">
          Coba Dan Uji Persona AI.
        </Title>
        <Text className="text-sm text-gray-900 @7xl:text-xl @7xl:leading-relaxed">
          Lingkungan sandbox untuk menguji prompt, gaya bahasa, dan alur percakapan.
        </Text>
        <Button className="!mt-7 gap-2" onClick={() => setIsChatOpen(true)}>
          <PiChatCircleDotsFill className="size-4" />
          <span>Mulai Chat</span>
        </Button>
      </Box>

      {/* Avatar SELALU JELAS */}
      <Box className="self-end pr-3 @md:pr-6 @4xl:pr-14">
        <Image
          src="/maya.webp"
          alt="AI Avatar"
          height={720}
          width={666}
          priority
          className="max-w-[120px] @sm:max-w-[150px] @md:max-w-[180px] @xl:max-w-[220px] @2xl:max-w-[250px] @4xl:max-w-[280px] @6xl:max-w-[400px]"
        />
      </Box>

      {/* DUPLIKAT-V2: Chat TRANSPARAN - bubble langsung di banner */}
      {isChatOpen && (
        <>
          {/* Chat Messages - TRANSPARAN tanpa background */}
          <Box 
            className="absolute top-4 left-4 bottom-4 w-[50%] z-20 overflow-y-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onClick={() => setIsChatOpen(false)}
          >
            <div className="space-y-2">
              {messages.map((msg) => (
                <Flex key={msg.id} justify={msg.sender === 'user' ? 'end' : 'start'}>
                  <div
                    className={cn(
                      'max-w-[90%] rounded-xl px-3 py-2',
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-white/90 text-gray-700 shadow-sm'
                    )}
                  >
                    <span className="text-xs">{msg.text}</span>
                  </div>
                </Flex>
              ))}
              {isTyping && (
                <Flex justify="start">
                  <div className="bg-white/90 rounded-xl px-3 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </Flex>
              )}
              <div ref={messagesEndRef} />
            </div>
          </Box>

          {/* Input Chat - KECIL di KANAN BAWAH */}
         {/* Input Chat - tinggi paling pendek */}
<div className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 bg-white rounded-full shadow-md px-2.5">
  <input
    type="text"
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
    placeholder="Ketik pesan..."
    className="w-24 text-[11px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 bg-transparent border-0 py-1"
  />
  <button
    onClick={handleSendMessage}
    disabled={!inputValue.trim()}
    className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none my-0.5"
  >
    <PiPaperPlaneRightFill className="size-2.5" />
  </button>
</div>
        </>
      )}
    </Flex>
  );
}
