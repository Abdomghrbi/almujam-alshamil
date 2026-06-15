'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = params?.id;

  useEffect(() => {
    if (!userId) {
      setError('معرف المستخدم غير موجود');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      setError('');

      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://almujam-alshamil-api.onrender.com';
        
        // جلب بيانات المستخدم
        const userRes = await fetch(`${apiBase}/api/auth/user/${encodeURIComponent(userId)}`);
        
        if (!userRes.ok) {
          if (userRes.status === 404) {
            throw new Error('المستخدم غير موجود');
          }
          throw new Error('خطأ في جلب البيانات');
        }

        const userData = await userRes.json();
        setUser(userData.user || userData);

        // جلب عدد الكلمات
        const countRes = await fetch(`${apiBase}/api/words/count?contributor_id=${encodeURIComponent(userId)}`);
        if (countRes.ok) {
          const countData = await countRes.json();
          setWordCount(countData.total_words || 0);
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

  const displayName = user.display_name || user.username || 'مستخدم';
  const avatar = user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=128`;
  const joinedDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString('ar-SY') 
    : '';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="flex items-center gap-2 text-surface-500 hover:text-surface-700 mb-6 transition-colors">
        <ArrowLeft size={20} />
        <span>العودة للرئيسية</span>
      </Link>

      <div className="card mb-8">
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt={displayName}
            className="w-20 h-20 rounded-full object-cover border-2 border-primary-500"
            onError={(e) => { 
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=128`; 
            }}
          />
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{displayName}</h1>
            {user.username && user.username !== displayName && (
              <p className="text-sm text-surface-500">@{user.username}</p>
            )}
            {user.bio && (
              <p className="text-sm text-surface-600 dark:text-surface-400 mt-2">{user.bio}</p>
            )}
            
            {/* عدد الكلمات */}
            <div className="flex items-center gap-2 text-sm text-surface-500 mt-2">
              <BookOpen size={14} />
              <span>{wordCount} {wordCount === 1 ? 'كلمة' : 'كلمات'} مضافة</span>
            </div>

            {joinedDate && (
              <div className="flex items-center gap-2 text-sm text-surface-500 mt-2">
                <Calendar size={14} />
                <span> تاريخ الانضمام {joinedDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
