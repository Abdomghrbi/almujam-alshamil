'use client';

import { useState } from 'react';
import ChatWindow from './ChatWindow';

export default function ChatWidget({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* زر الروبوت */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="فتح المحادثة"
      >
        <svg 
  className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" 
  fill="none" 
  stroke="currentColor" 
  viewBox="0 0 24 24"
>
  <path 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth={2} 
    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
  />
</svg>

        
        
        {/* نقطة حمراء للتنبيه */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      </button>

      {/* نافذة المحادثة */}
      {isOpen && <ChatWindow user={user} onClose={() => setIsOpen(false)} />}
    </>
  );
}
