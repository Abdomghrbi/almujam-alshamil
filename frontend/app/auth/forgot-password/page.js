'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setMessage('');

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://almujam-alshamil-api.onrender.com';

    try {
      const res = await fetch(
        `${apiUrl}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(
          data.message ||
          'إذا كان البريد مسجلاً فستصلك رسالة إعادة التعيين'
        );
      } else {
        setError(
          data.error || 'حدث خطأ أثناء إرسال الطلب'
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
              <Mail size={24} className="text-white" />
            </div>

            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              نسيت كلمة المرور
            </h1>

            <p className="text-surface-500 text-sm mt-1">
              أدخل بريدك الإلكتروني لإرسال رابط إعادة التعيين
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-700 text-center">
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1.5">
                البريد الإلكتروني
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400"
                />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="input-field pr-10"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 flex items-center justify-center gap-2"
            >
              <Send size={16} />

              {loading
                ? 'جاري الإرسال...'
                : 'إرسال رابط إعادة التعيين'}
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-surface-500">
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
