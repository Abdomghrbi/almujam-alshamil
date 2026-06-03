'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!token) {
      setError('رابط إعادة التعيين غير صالح');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        'https://almujam-alshamil-api.onrender.com';

      const res = await fetch(
        `${apiUrl}/api/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token,
            password
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess(
          data.message || 'تم تغيير كلمة المرور بنجاح'
        );

        setTimeout(() => {
          router.push('/auth/login');
        }, 2500);
      } else {
        setError(
          data.error || 'حدث خطأ أثناء إعادة التعيين'
        );
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
              <Lock size={24} className="text-white" />
            </div>

            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              إعادة تعيين كلمة المرور
            </h1>

            <p className="text-surface-500 text-sm mt-1">
              أدخل كلمة المرور الجديدة
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-700 text-center flex items-center justify-center gap-2">
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1.5">
                كلمة المرور الجديدة
              </label>

              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="input-field"
                placeholder="أدخل كلمة المرور الجديدة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1.5">
                تأكيد كلمة المرور
              </label>

              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="input-field"
                placeholder="أعد إدخال كلمة المرور"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3"
            >
              {loading
                ? 'جاري الحفظ...'
                : 'حفظ كلمة المرور الجديدة'}
            </button>
          </form>

          <div className="text-center mt-4 text-sm">
            <Link
              href="/auth/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              العودة إلى تسجيل الدخول
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
    }
