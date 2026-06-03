'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../layout';
import { LogIn, User, Lock } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://almujam-alshamil-api.onrender.com';
    const endpoint = `${apiUrl}/api/auth/login`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      let responseBody = null;
      try {
        responseBody = await res.text();
      } catch (e) {
        responseBody = '⚠️ تعذر قراءة الرد';
      }

      let parsedData = null;
      try {
        parsedData = JSON.parse(responseBody);
      } catch (e) {
        parsedData = responseBody;
      }

      if (res.ok && parsedData?.token) {
        login(parsedData.token, parsedData.user);
        router.push('/');
      } else {
        setError(parsedData?.error || parsedData?.message || `خطأ ${res.status}`);
      }
    } catch (err) {
      setError('فشل الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
              <LogIn size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">تسجيل الدخول</h1>
            <p className="text-surface-500 text-sm mt-1">ساهم في إثراء المعجم الشامل</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          <<form onSubmit={handleSubmit} className="space-y-4">
     <div>
    <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1.5">
      اسم المستخدم
    </label>

    <div className="relative">
      <User
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400"
      />

      <input
        type="text"
        value={form.username}
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
        required
        className="input-field pr-10"
        placeholder="أدخل اسم المستخدم"
      />
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1.5">
      كلمة المرور
    </label>

    <div className="relative">
      <Lock
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400"
      />

      <input
        type="password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        required
        className="input-field pr-10"
        placeholder="أدخل كلمة المرور"
      />
    </div>

    <div className="mt-2 text-left">
      <Link
        href="/auth/forgot-password"
        className="text-xs text-primary-600 hover:text-primary-700"
      >
        نسيت كلمة المرور؟
      </Link>
    </div>
  </div>

  <button
    type="submit"
    disabled={loading}
    className="btn-primary w-full !py-3"
  >
    {loading ? 'جاري الدخول…' : 'تسجيل الدخول'}
  </button>
</form>

          <div className="text-center mt-4 text-sm text-surface-500">
            ليس لديك حساب؟{' '}
            <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">إنشاء حساب جديد</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
