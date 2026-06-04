'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Github, Heart, BookOpen, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../app/layout';

export default function Footer() {
  const { user } = useAuth();
  const [pendingWords, setPendingWords] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadFooterStats = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://almujam-alshamil-api.onrender.com';
        const res = await fetch(`${apiBase}/api/stats`, { cache: 'no-store' });
        const data = await res.json();

        if (!cancelled && res.ok) {
          setPendingWords(Number(data.pendingWords ?? 0));
        }
      } catch (err) {
        if (!cancelled) setPendingWords(null);
      }
    };

    loadFooterStats();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="bg-surface-50 dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg">المعجم الشامل</span>
            </div>
            <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
              موسوعة مفتوحة المصدر توثّق الكلمات العربية الفصحى واللهجات المتنوعة من كل أنحاء الوطن العربي، مع تسجيلات صوتية ونطق أصلي.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-surface-700 dark:text-surface-300 mb-3">روابط سريعة</h3>
            <div className="space-y-2 text-sm">
              <Link href="/search" className="block text-surface-500 hover:text-primary-600 transition-colors">البحث في المعجم</Link>
              <Link href="/add" className="block text-surface-500 hover:text-primary-600 transition-colors">إضافة كلمة جديدة</Link>
              {!user && (
                <Link href="/auth/register" className="block text-surface-500 hover:text-primary-600 transition-colors">إنشاء حساب</Link>
              )}
            </div>
          </div>

          {/* Pending Words */}
          <div>
            <h3 className="font-bold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary-600" />
              المساهمة 
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed mb-3">
              لدينا الآن <strong className="text-surface-700 dark:text-surface-200">{pendingWords === null ? '…' : Number(pendingWords).toLocaleString('ar-EG')}</strong> كلمة مُعلّقة تنتظر المراجعة.
            </p>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-3">
              تواصل معنا:
            </p>
            <a
              href="mailto: abdomghrbi@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              <Mail size={16} />
              moderation@example.com
            </a>
          </div>

          {/* Open Source */}
          <div>
            <h3 className="font-bold text-surface-700 dark:text-surface-300 mb-3">مشروع مفتوح المصدر</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-3">
              هذا المشروع متاح للجميع. ساهم في تطويره!
            </p>
            <a
              href="https://github.com/Abdomghrbi/almujam-alshamil"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Github size={16} />
              GitHub
            </a>
          </div>
        </div>

        <div className="border-t border-surface-200 dark:border-surface-700 mt-6 pt-6 text-center text-sm text-surface-400">
          <p className="flex items-center justify-center gap-1">
            بُني بـ <Heart size={14} className="text-red-500 fill-red-500" /> من أجل اللغة العربية
          </p>
        </div>
      </div>
    </footer>
  );
}
