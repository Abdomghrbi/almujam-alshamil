'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../app/layout';
import { BookOpen, PlusCircle, Search, User, LogOut, Sun, Moon, Menu, X, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const canModerate = user?.role === 'admin' || user?.role === 'moderator';

  const navLinks = [
    { href: '/', label: 'الرئيسية', icon: BookOpen },
    { href: '/search', label: 'بحث', icon: Search },
    ...(user ? [{ href: '/add', label: 'أضف كلمة', icon: PlusCircle }] : []),
    ...(canModerate ? [{ href: '/moderation', label: 'لوحة المشرفين', icon: Shield }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all ring-1 ring-white/30">
              <BookOpen size={20} className="text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold bg-gradient-to-l from-primary-600 to-accent-600 bg-clip-text text-transparent">
                المُعجم الشامل
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
               href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-sm font-medium"
             >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <User size={14} className="text-primary-600" />
                  <span className="text-sm font-medium text-primary-700 dark:text-primary-300">{user.username}</span>
                </div>
                <button onClick={logout} className="btn-outline !py-1.5 !px-3 !text-sm">
                  <LogOut size={14} className="inline ml-1" />
                  خروج
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="btn-primary !py-1.5 !px-4 !text-sm hidden md:block">
                تسجيل دخول
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all"
               aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              >
             {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all text-sm font-medium"
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
            <div className="border-t border-surface-200 dark:border-surface-700 pt-2 mt-2">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-surface-500">@{user.username}</div>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-right px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm font-medium">
                    <LogOut size={16} className="inline ml-1" /> خروج
                  </button>
                </div>
              ) : (
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block w-full text-center btn-primary !py-2.5 !text-sm">
                  دخول / تسجيل
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
