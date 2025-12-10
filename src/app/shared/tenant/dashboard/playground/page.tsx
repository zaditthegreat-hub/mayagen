// AiChat.tsx
'use client';

import Image from 'next/image';
import cn from '@core/utils/class-names';
import Logo from '@public/newsletter-3.svg';
import AIChatForm from '../../cs/playground/chatForm';
import { useState } from 'react';

export default function AiChat({ className }: { className?: string }) {
  const [hasMessage, setHasMessage] = useState(false); // state untuk animasi

  return (
    <div
      className={cn(
        className,
        'rounded-2xl border border-gray-100 bg-white @container dark:bg-gray-50 shadow-sm h-full'
      )}
    >
      <div className="flex h-full w-full flex-col items-center justify-center p-3">
        <div
          className={cn(
            'w-full max-w-[640px] flex flex-col justify-between transition-all duration-500',
            hasMessage ? 'h-[100%]' : 'h-[19%]'
          )}
        >
          <AIChatForm setHasMessage={setHasMessage} />
        </div>
      </div>
    </div>
  );
}
