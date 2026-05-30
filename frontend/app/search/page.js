'use client';

import { useState } from 'react';
import { Globe, ChevronDown, ChevronUp, User } from 'lucide-react';

export default function WordCard({ word }) {
  const [expanded, setExpanded] = useState(false);

  // حماية من undefined + دعم الشكل القديم والجديد
  const entries = word.entries || [
    {
      meaning: word.meaning,
      country: word.country,
      city: word.city,
      state: word.state,
    },
  ];

  const entriesToShow = expanded ? entries : entries.slice(0, 2);

  return (
    <div className="card p-4 space-y-3">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">
            {word.word}
          </h2>

          <div className="text-sm text-surface-500 mt-1">
            {word.word_type}
            {word.root && <span> • الجذر: {word.root}</span>}
          </div>
        </div>

        <div className="text-xs text-surface-400 flex items-center gap-1">
          <User size={14} />
          {word.contributors?.length ? word.contributors.join(', ') : '—'}
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {entriesToShow.map((entry, i) => (
          <div
            key={i}
            className="border border-surface-200 dark:border-surface-700 rounded-xl p-3 bg-surface-50 dark:bg-surface-800/40"
          >
            <div className="text-surface-800 dark:text-surface-200">
              {entry.meaning}
            </div>

            <div className="flex items-center gap-2 text-xs text-surface-500 mt-2">
              <Globe size={14} />
              <span>
                {entry.country}
                {entry.city && ` - ${entry.city}`}
                {entry.state && ` (${entry.state})`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Expand */}
      {entries.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          {expanded ? (
            <>
              إظهار أقل <ChevronUp size={16} />
            </>
          ) : (
            <>
              عرض المزيد ({entries.length - 2}) <ChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
