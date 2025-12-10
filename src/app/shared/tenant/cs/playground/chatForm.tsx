// AiChatPage.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import FileUpload from '@/app/shared/file-upload';
import { useModal } from '@/app/shared/modal-views/use-modal';

import {chatPlayground } from '@/api';

interface AiChatPageProps {
  setHasMessage?: (val: boolean) => void;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  file?: File; // Add optional file property
}

export default function AiChatPage({ setHasMessage }: AiChatPageProps) {
  const { tenantId } = useParams();
  const { openModal } = useModal();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showBubble, setShowBubble] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // New state for selected file

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    let newHeight = textarea.scrollHeight;
    const maxHeight = 200;
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.overflowY = 'hidden';
    }
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.addEventListener('input', autoResize);
    autoResize();

    return () => textarea.removeEventListener('input', autoResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setShowBubble(true);
    setIsLoading(true);

    try {
      const response = await chatPlayground({ message: userMessage.text, tenantId });
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        text: response?.output || JSON.stringify(response),
        sender: 'ai',
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        text: 'Maaf, terjadi kesalahan saat memproses permintaan Anda.',
        sender: 'ai',
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }

    if (setHasMessage) {
      setHasMessage(true);
    }
  };

  useEffect(() => {
    autoResize();
  }, [message]);


  return (
    <>
        <main className="flex-grow flex flex-col justify-center items-center transition-opacity duration-500"
              style={{ opacity: showBubble ? 0 : 1 }}>
        <h1 className="text-3xl md:text-3xl font-bold text-blue-600 mb-8">
          Halo, Ada yang bisa saya bantu?
        </h1>
      </main>

        {/* Chat bubbles */}
        <div className="w-full flex flex-col gap-3 mb-4 px-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                msg.sender === 'user'
                  ? 'self-end bg-blue-600 text-white'
                  : 'self-start bg-gray-200 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      {/* Footer / Input Chat */}
        <footer className="w-full max-w-4xl px-4">
          <form onSubmit={handleSubmit} className="w-full bg-white border border-gray-200 rounded-3xl shadow-lg shadow-gray-100/50 flex items-center p-2 pr-3 gap-2">
          <div className="flex items-center flex-shrink-0 gap-2">
            {/* <button
              type="button"
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Tambah lampiran"
              onClick={() => openModal({ view: <FileUpload /> })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button> */}

            {/* <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium" aria-label="Buka tools">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
              </svg>
              <span>Tools</span>
            </button> */}
          </div>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
            className="flex-1 w-full mx-2 bg-transparent border-none outline-none focus:ring-0 placeholder-gray-500 text-gray-800 text-base resize-none"
            placeholder="Kirim pesan..."
          />

          <div className="flex items-center flex-shrink-0 gap-2">
            {/* <button className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium" aria-label="Pilih model">
              <span>2.5 Pro</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button> */}

            {/* Tombol Kirim */}
              <button
                type="submit"
                className="p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                aria-label="Kirim pesan"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L6 12Zm0 0h7.5" />
                  </svg>
                )}
              </button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-3">
            Anda sedang berada dalam playground, semua chat tidak akan tersimpan.
        </p>
      </footer>
    </>
  );
}
