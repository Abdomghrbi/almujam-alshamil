'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../layout';
import { Shield, Check, X, Mic, MapPin } from 'lucide-react';

export default function ModerationPage() {
  const { user } = useAuth();
  const [pendingWords, setPendingWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') fetchPending();
    else setLoading(false);
  }, [user]);

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://almujam-alshamil-api.onrender.com'}/api/moderation/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPendingWords(data.words || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (wordId, action) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://almujam-alshamil-api.onrender.com'}/api/moderation/${wordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setPendingWords(pendingWords.filter(w => w.id !== wordId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="card">
          <Shield size={48} className="mx-auto mb-4 text-surface-300" />
          <h2 className="text-xl font-bold text-surface-800 dark:text-white mb-2">غير مصرح</h2>
          <p className="text-surface-500">هذه الصفحة مخصصة لفريق الإشراف فقط.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield size={24} className="text-primary-500" />
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">لوحة الإشراف</h1>
        <span className="badge-primary">{pendingWords.length} كلمة بانتظار المراجعة</span>
      </div>

      {pendingWords.length === 0 ? (
        <div className="text-center py-16 card">
          <Check size={48} className="mx-auto mb-4 text-emerald-400" />
          <p className="text-surface-500 text-lg">لا توجد كلمات بانتظار المراجعة. مبروك! 🎉</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingWords.map((word) => (
            <div key={word.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-surface-800 dark:text-white">{word.word}</h3>
                  <span className="text-sm text-surface-500">بواسطة @{word.addedBy} — {new Date(word.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
                <span className={`badge ${word.type === 'لهجة' ? 'badge-accent' : 'badge-primary'}`}>{word.type}</span>
              </div>

              <p className="text-surface-600 dark:text-surface-400 mb-3">{word.meaning}</p>

              {word.root && <div className="text-sm text-surface-500 mb-2">الجذر: {word.root}</div>}

              {word.synonyms && <div className="text-sm text-surface-500 mb-3">مرادفات: {word.synonyms}</div>}

              <div className="flex items-center gap-4 text-sm text-surface-400 mb-4">
                {word.country && <span className="flex items-center gap-1"><MapPin size={14} /> {word.country}{word.state ? ` / ${word.state}` : ''}{word.city ? ` / ${word.city}` : ''}</span>}
                {word.hasAudio && <span className="flex items-center gap-1"><Mic size={14} /> يوجد تسجيل صوتي</span>}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAction(word.id, 'approve')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all text-sm font-medium"
                >
                  <Check size={16} /> قبول
                </button>
                <button
                  onClick={() => handleAction(word.id, 'reject')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all text-sm font-medium"
                >
                  <X size={16} /> رفض
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
