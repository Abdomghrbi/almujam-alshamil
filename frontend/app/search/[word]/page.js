'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BookOpen, MapPin, Mic, Hash } from 'lucide-react';

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
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://almujam-alshamil-api.onrender.com';
      const identifier = decodeURIComponent(word);

      const detailRes = await fetch(`${apiBase}/api/words/${encodeURIComponent(identifier)}`);
      if (detailRes.ok) {
        const data = await detailRes.json();
        setWordData(data.word || data);
        return;
      }

      // Fallback: search endpoint, then pick the matching entry client-side
      const searchRes = await fetch(`${apiBase}/api/search?q=${encodeURIComponent(identifier)}`);
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const results = searchData.words || [];
        const normalized = identifier.toLowerCase();

        const match = results.find((item) => {
          const wordValue = (item.word || '').toLowerCase();
          const slugValue = (item.slug || '').toLowerCase();
          return wordValue === normalized || slugValue === normalized || slugValue === identifier || wordValue === identifier.toLowerCase();
        });

        if (match) {
          setWordData(match);
          return;
        }
      }

      throw new Error('لم يتم العثور على الكلمة');
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

  const audioSource = wordData.audio_clips?.[0]?.file_url || wordData.audioUrl || '';
  const playableAudio = audioSource
    ? (audioSource.startsWith('data:') || audioSource.startsWith('http')
      ? audioSource
      : `data:audio/webm;base64,${audioSource}`)
    : '';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-1">{wordData.word}</h1>
            <span className={`badge ${wordData.word_type === 'كنية' ? 'badge-accent' : 'badge-primary'}`}>
              {wordData.word_type || 'كلمة'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {wordData.language && (
            <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
              <span>اللغة: <strong>{wordData.language}</strong></span>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-surface-500 mb-1">المعنى</h3>
            <p className="text-surface-800 dark:text-surface-200 text-lg leading-relaxed">{wordData.meaning}</p>
          </div>

          {wordData.example_usage && (
            <div>
              <h3 className="text-sm font-medium text-surface-500 mb-1">مثال استخدام</h3>
              <p className="text-surface-700 dark:text-surface-300 leading-relaxed">{wordData.example_usage}</p>
            </div>
          )}

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

          {playableAudio && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-surface-500 mb-2">التسجيل الصوتي</h3>
              <audio src={playableAudio} controls className="w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
