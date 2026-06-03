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
  <svg 
    className="w-7 h-7 text-white group-hover:rotate-12 transition-transform"
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    style={{ width: '28px', height: '28px' }}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
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
