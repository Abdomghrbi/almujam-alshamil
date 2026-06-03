
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
        className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="فتح المحادثة"
      >
        <svg 
          className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
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
