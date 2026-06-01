'use client';

import Link from 'next/link';
import { MapPin, Mic, Hash, ArrowLeft } from 'lucide-react';

export default function WordCard({ word }) {
  return (
    <Link href={`/search/${encodeURIComponent(word.slug || word.word)}`} className="card-hover block">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-surface-800 dark:text-white">{word.word}</h3>
          <span className={`badge ${word.word_type === 'كنية' ? 'badge-accent' : 'badge-primary'}`}>{word.word_type || 'كلمة'}</span>
        </div>
        <ArrowLeft size={18} className="text-surface-400 shrink-0 mt-1" />
      </div>

      <p className="text-surface-600 dark:text-surface-400 text-sm mb-3 line-clamp-2">
        {word.meaning}
      </p>

      {word.example_usage && (
        <p className="text-xs text-surface-500 dark:text-surface-400 mb-3 line-clamp-2">
          مثال: {word.example_usage}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-surface-400 flex-wrap">
        {word.root && (
          <span className="flex items-center gap-1">
            <Hash size={12} />
            {word.root}
          </span>
        )}
        {word.language && (
          <span className="flex items-center gap-1">
            {word.language}
          </span>
        )}
        {(word.country || word.state || word.district) && (
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {word.country}{word.state ? `, ${word.state}` : ''}{word.district ? `, ${word.district}` : ''}
          </span>
        )}
        {(word.has_audio || word.hasAudio) && (
          <span className="flex items-center gap-1 text-accent-500">
            <Mic size={12} />
            تسجيل
          </span>
        )}
      </div>
    </Link>
  );
}
