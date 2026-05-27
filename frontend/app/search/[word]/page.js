'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BookOpen, MapPin, Mic, Hash, ArrowRight, Volume2, Globe } from 'lucide-react';

export default function WordDetailPage() {
  const params = useParams();
  const wordSlug = params.word;
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedWords, setRelatedWords] = useState([]);

  useEffect(() => {
    fetchWord();
  }, [wordSlug]);

  const fetchWord = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://almujam-alshamil-api.onrender.com'}/api/words/${encodeURIComponent(wordSlug)}`);
      const data = await res.json();
      setWord(data.word);
      setRelatedWords(data.related || []);
    } catch (err) {
      console.error(err);
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

  if (!word) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <BookOpen size={48} className="mx-auto mb-4 text-surface-300" />
        <p className="text-surface-500 text-lg">هذه الكلمة غير موجودة في المعجم</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-400 mb-6">
        <a href="/" className="hover:text-primary-500 transition-colors">الرئيسية</a>
        <ArrowRight size={14} />
        <a href="/search" className="hover:text-primary-500 transition-colors">المعجم</a>
        <ArrowRight size={14} />
        <span className="text-surface-600 dark:text-surface-300 font-medium">{word.word}</span>
      </div>

      {/* Word Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-2">{word.word}</h1>
            {word.root && (
              <div className="flex items-center gap-1.5 text-sm text-surface-500">
                <Hash size={14} />
                <span>الجذر: <span className="font-bold text-surface-700 dark:text-surface-300">{word.root}</span></span>
              </div>
            )}
          </div>
          <span className={`badge ${word.type === 'لهجة' ? 'badge-accent' : 'badge-primary'}`}>
            {word.type}
          </span>
        </div>
      </div>

      {/* Meaning */}
      <div className="card mb-4">
        <h2 className="font-bold text-surface-700 dark:text-surface-300 mb-2">المعنى</h2>
        <p className="text-surface-600 dark:text-surface-400 leading-relaxed text-lg">{word.meaning}</p>
      </div>

      {/* Synonyms */}
      {word.synonyms && word.synonyms.length > 0 && (
        <div className="card mb-4">
          <h2 className="font-bold text-surface-700 dark:text-surface-300 mb-3">مرادفات</h2>
          <div className="flex flex-wrap gap-2">
            {word.synonyms.map((syn, i) => (
              <a key={i} href={`/search/${encodeURIComponent(syn)}`} className="px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-all text-sm">
                {syn}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Audio */}
      {word.audioUrl && (
        <div className="card mb-4">
          <h2 className="font-bold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
            <Mic size={18} className="text-accent-500" />
            التسجيل الصوتي
          </h2>
          <audio controls className="w-full" src={word.audioUrl}>
            متصفحك لا يدعم تشغيل الصوت
          </audio>
        </div>
      )}

      {/* Location Info */}
      <div className="card mb-4">
        <h2 className="font-bold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
          <MapPin size={18} className="text-primary-500" />
          الموقع الجغرافي
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {word.country && (
            <div>
              <div className="text-xs text-surface-400 mb-1">البلد</div>
              <div className="font-medium text-surface-700 dark:text-surface-300">{word.country}</div>
            </div>
          )}
          {word.state && (
            <div>
              <div className="text-xs text-surface-400 mb-1">المحافظة</div>
              <div className="font-medium text-surface-700 dark:text-surface-300">{word.state}</div>
            </div>
          )}
          {word.city && (
            <div>
              <div className="text-xs text-surface-400 mb-1">المدينة</div>
              <div className="font-medium text-surface-700 dark:text-surface-300">{word.city}</div>
            </div>
          )}
          {word.region && (
            <div>
              <div className="text-xs text-surface-400 mb-1">المنطقة</div>
              <div className="font-medium text-surface-700 dark:text-surface-300">{word.region}</div>
            </div>
          )}
        </div>
      </div>

      {/* Added by */}
      {word.addedBy && (
        <div className="text-sm text-surface-400 text-center mb-6">
          أضيف بواسطة <span className="font-medium text-surface-500">@{word.addedBy}</span>
          {word.createdAt && <> — {new Date(word.createdAt).toLocaleDateString('ar-SA')}</>}
        </div>
      )}

      {/* Related Words */}
      {relatedWords.length > 0 && (
        <div>
          <h2 className="font-bold text-surface-700 dark:text-surface-300 mb-4">كلمات ذات صلة</h2>
          <div className="space-y-3">
            {relatedWords.map((rel, i) => (
              <a key={i} href={`/search/${encodeURIComponent(rel.word)}`} className="card-hover flex items-center justify-between">
                <div>
                  <div className="font-bold text-surface-800 dark:text-white">{rel.word}</div>
                  <div className="text-sm text-surface-500">{rel.meaning?.slice(0, 80)}</div>
                </div>
                <ArrowRight size={18} className="text-surface-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
