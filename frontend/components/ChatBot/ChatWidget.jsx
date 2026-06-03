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
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- رأس الروبوت -->
  <rect x="40" y="40" width="120" height="120" rx="20" fill="#2A2A2A" stroke="#00FFCC" stroke-width="12"/>
  
  <!-- عيون -->
  <rect x="70" y="75" width="20" height="25" rx="4" fill="#00FFCC"/>
  <rect x="110" y="75" width="20" height="25" rx="4" fill="#00FFCC"/>
  
  <!-- فم -->
  <rect x="65" y="120" width="70" height="12" rx="2" fill="#00FFCC"/>
  
  <!-- أذن يسرى -->
  <rect x="20" y="70" width="18" height="45" rx="5" fill="#2A2A2A" stroke="#00FFCC" stroke-width="10"/>
  <!-- أذن يمنى -->
  <rect x="162" y="70" width="18" height="45" rx="5" fill="#2A2A2A" stroke="#00FFCC" stroke-width="10"/>
  
  <!-- هوائي -->
  <line x1="100" y1="40" x2="100" y2="15" stroke="#00FFCC" stroke-width="8"/>
  <circle cx="100" cy="12" r="8" fill="#FF0066"/>
  
  <!-- براغي صغيرة -->
  <circle cx="55" cy="55" r="6" fill="#111"/>
  <circle cx="145" cy="55" r="6" fill="#111"/>
  <circle cx="55" cy="145" r="6" fill="#111"/>
  <circle cx="145" cy="145" r="6" fill="#111"/>
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
