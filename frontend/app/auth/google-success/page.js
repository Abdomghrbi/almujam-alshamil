'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function GoogleSuccessPage() {
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/';
    } else {
      window.location.href = '/auth/login';
    }
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      جاري تسجيل الدخول...
    </div>
  );
}
