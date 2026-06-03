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
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-br from-[#00ffff] to-[#ff0000] rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="فتح المحادثة"
        style={{ width: '45px', height: '45px' }}
      >
        {/* رأس الروبوت الجديد */}
        <svg 
          className="w-7 h-7 text-white group-hover:rotate-12 transition-transform"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{ width: '28px', height: '28px' }}
        >
          {/* رأس الروبوت */}
          <rect 
            x="6" 
            y="7" 
            width="12" 
            height="12" 
            rx="2" 
            strokeWidth="1.7" 
            strokeLinecap="round"
          />
          
          {/* عيون */}
          <circle cx="10" cy="11.5" r="1" fill="currentColor" stroke="none"/>
          <circle cx="14" cy="11.5" r="1" fill="currentColor" stroke="none"/>
          
          {/* فم */}
          <path 
            d="M9 16 L15 16" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          
          {/* أذن يسرى */}
          <rect 
            x="3" 
            y="10" 
            width="2" 
            height="5" 
            rx="0.5" 
            strokeWidth="1.7"
          />
          
          {/* أذن يمنى */}
          <rect 
            x="19" 
            y="10" 
            width="2" 
            height="5" 
            rx="0.5" 
            strokeWidth="1.7"
          />
          
          {/* هوائي */}
          <line 
            x1="12" 
            y1="7" 
            x2="12" 
            y2="4" 
            strokeWidth="1.7" 
            strokeLinecap="round"
          />
          <circle 
            cx="12" 
            cy="3.2" 
            r="1" 
            fill="currentColor" 
            stroke="none"
          />
        </svg>

        {/* نقطة حمراء للتنبيه */}
        <span 
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse"
          style={{ backgroundColor: '#ff0000' }}
        />
      </button>

      {/* نافذة المحادثة */}
      {isOpen && <ChatWindow user={user} onClose={() => setIsOpen(false)} />}
    </>
  );
}
