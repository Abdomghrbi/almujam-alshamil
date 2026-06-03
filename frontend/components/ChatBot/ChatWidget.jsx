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
    <!-- رأس الروبوت -->
    <rect 
      x="6" 
      y="7" 
      width="12" 
      height="12" 
      rx="2" 
      strokeWidth="1.5" 
    />
    
    <!-- عيون -->
    <rect 
      x="9" 
      y="10" 
      width="1.5" 
      height="2" 
      rx="0.2" 
      fill="currentColor" 
      stroke="none"
    />
    <rect 
      x="13.5" 
      y="10" 
      width="1.5" 
      height="2" 
      rx="0.2" 
      fill="currentColor" 
      stroke="none"
    />
    
    <!-- فم -->
    <path 
      d="M9 16 H15" 
      strokeWidth="1.2" 
      strokeLinecap="round"
    />
    
    <!-- أذن يسرى -->
    <rect 
      x="3.5" 
      y="10" 
      width="2" 
      height="4" 
      rx="0.5" 
      strokeWidth="1.5" 
    />
    
    <!-- أذن يمنى -->
    <rect 
      x="18.5" 
      y="10" 
      width="2" 
      height="4" 
      rx="0.5" 
      strokeWidth="1.5" 
    />
    
    <!-- هوائي -->
    <line 
      x1="12" 
      y1="7" 
      x2="12" 
      y2="3.5" 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
    <circle 
      cx="12" 
      cy="3" 
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
