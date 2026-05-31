'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BookOpen, MapPin, Mic, Hash, ArrowRight } from 'lucide-react';

export default function WordDetailPage() {
  const params = useParams();
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params?.word) fetchWord(params.word);
  }, [params?.word]);

  const fetchWord = async (word) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://almujam-alshamil-api.onrender.com'}/api/words/${encodeURIComponent(word)}`
      );
      if (!res.ok) throw new Error('لم يتم العثور على الكلمة');
      const data = await res.json();
      setWordData(data.word || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card">
          <BookOpen size={48} className="mx-auto mb-4 text-surface-300" />
          <h2 className="text-xl font-bold text-surface-800 dark:text-white mb-2">لم نعثر على الكلمة</h2>
          <p className="text-surface-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!wordData) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-1">{wordData.word}</h1>
            <span className={`badge ${wordData.type === 'لهجة' ? 'badge-accent' : 'badge-primary'}`}>
              {wordData.word_type || wordData.type || 'مفردة'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-surface-500 mb-1">المعنى</h3>
            <p className="text-surface-800 dark:text-surface-200 text-lg leading-relaxed">{wordData.meaning}</p>
          </div>

          {wordData.root && (
            <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
              <Hash size={14} />
              <span>الجذر: <strong>{wordData.root}</strong></span>
            </div>
          )}

          {wordData.pronunciation && (
            <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
              <Mic size={14} />
              <span>النطق: <strong>{wordData.pronunciation}</strong></span>
            </div>
          )}

          {(wordData.country || wordData.state || wordData.city) && (
            <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
              <MapPin size={14} />
              <span>
                {wordData.country}
                {wordData.state ? ` / ${wordData.state}` : ''}
                {wordData.city ? ` / ${wordData.city}` : ''}
              </span>
            </div>
          )}

          {wordData.audioUrl && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-surface-500 mb-2">التسجيل الصوتي</h3>
              <audio src={wordData.audioUrl} controls className="w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}