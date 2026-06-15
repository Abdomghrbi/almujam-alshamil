'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Mail, Calendar, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = params?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      setLoading(true);
      setError('');

      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://almujam-alshamil-api.onrender.com';

        // جلب بيانات المستخدم
        const userRes = await fetch(`${apiBase}/api/users/${encodeURIComponent(userId)}`);
        
        if (!userRes.ok) {
          throw new Error('المستخدم غير موجود');
        }

        const userData = await userRes.json();
        setUser(userData.user || userData);

        // جلب كلمات المستخدم (لو الـ API بيدعمها)
        try {
          const wordsRes = await fetch(`${apiBase}/api/words?contributor_id=${encodeURIComponent(userId)}`);
          if (wordsRes.ok) {
            const wordsData = await wordsRes.json();
            setWords(wordsData.words || wordsData || []);
          }
        } catch {
          // لو ما في endpoint للكلمات، ما في مشكلة
          setWords([]);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

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
          <h2 className="text-xl font-bold text-surface-800 dark:text-white mb-2">خطأ</h2>
          <p className="text-surface-500">{error}</p>
          <Link href="/" className="mt-4 inline-block text-primary-500 hover:underline">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.display_name || user.name || user.username || 'مستخدم';
  const avatar = user.avatar || user.avatar_url || user.contributor_avatar || '/default-avatar.png';
  const joinedDate = user.created_at ? new Date(user.created_at).toLocaleDateString('ar-SY') : '';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* زر الرجوع */}
      <Link 
        href="/" 
        className="flex items-center gap-2 text-surface-500 hover:text-surface-700 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>العودة للرئيسية</span>
      </Link>

      {/* بطاقة المستخدم */}
      <div className="card mb-8">
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt={displayName}
            className="w-20 h-20 rounded-full object-cover border-2 border-primary-500"
            onError={(e) => { e.target.src = '/default-avatar.png'; }}
          />
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              {displayName}
            </h1>
            {user.email && (
              <div className="flex items-center gap-2 text-sm text-surface-500 mt-1">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>
            )}
            {joinedDate && (
              <div className="flex items-center gap-2 text-sm text-surface-500 mt-1">
                <Calendar size={14} />
                <span>انضم بتاريخ {joinedDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* كلمات المستخدم */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={20} className="text-primary-500" />
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">
            الكلمات المضافة ({words.length})
          </h2>
        </div>

        {words.length === 0 ? (
          <p className="text-surface-500 text-center py-8">
            لم يتم إضافة كلمات بعد
          </p>
        ) : (
          <div className="space-y-3">
            {words.map((word) => (
              <Link
                key={word.id || word.slug}
                href={`/word/${encodeURIComponent(word.slug || word.word)}`}
                className="block p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:border-primary-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-surface-900 dark:text-white">
                      {word.word}
                    </h3>
                    <p className="text-sm text-surface-500 mt-1 line-clamp-1">
                      {word.meaning}
                    </p>
                  </div>
                  <span className={`badge ${word.word_type === 'كنية' ? 'badge-accent' : 'badge-primary'}`}>
                    {word.word_type || 'كلمة'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
      }
