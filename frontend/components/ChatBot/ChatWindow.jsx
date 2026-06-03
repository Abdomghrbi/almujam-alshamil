
'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatWindow({ user, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 0,
      text: `مرحباً يا ${user?.username || 'صديقي'}! 👋\n\nأنا مساعدك الشخصي في منصة المعجم الشامل. أنا هنا لأساعدك في استكشاف المعجم وإضافة كلمات جديدة.\n\nما هي الكلمة التي تريد إضافتها اليوم؟ ✨`,
      isUser: false
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    // إضافة رسالة المستخدم
    const userMessage = {
      id: Date.now(),
      text,
      isUser: true
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://almujam-alshamil-api.onrender.com';
      
      const response = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
        message: text,
       username: user?.username || 'صديقي'
        })
      });

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.reply || 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
        isUser: false
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'عذراً يا صديقي، حدث خطأ في الاتصال. هل يمكنك المحاولة مرة أخرى؟ 🙏',
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 left-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-white dark:bg-surface-800 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
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
          </div>
          <div>
            <p className="text-emerald-100 text-xs">المساعد الذكي</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-50 dark:bg-surface-900">
        {messages.map(msg => (
          <ChatMessage key={msg.id} text={msg.text} isUser={msg.isUser} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-surface-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="text-sm mr-2">يكتب...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
            }
