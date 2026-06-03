'use client';

export default function ChatMessage({ text, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] p-3 rounded-2xl ${
        isUser 
          ? 'bg-emerald-500 text-white rounded-bl-md' 
          : 'bg-white dark:bg-surface-700 text-surface-800 dark:text-surface-100 shadow-sm border border-surface-200 dark:border-surface-600 rounded-br-md'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}
