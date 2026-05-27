'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load theme preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    setLoading(false);

    // Check auth token
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setUser(data.user); })
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', darkMode ? 'light' : 'dark');
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <html lang="ar" dir="rtl">
        <body className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </body>
      </html>
    );
  }

  return (
    <html lang="ar" dir="rtl" className={darkMode ? 'dark' : ''}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>المعجم الشامل — موسوعة اللهجات والمفردات العربية</title>
        <meta name="description" content="المعجم الشامل هو قاموس مفتوح المصدر يوثق الكلمات العربية الفصحى واللهجات المتنوعة مع التسجيلات الصوتية." />
        <meta name="theme-color" content="#4c6ef5" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthContext.Provider value={{ user, login, logout, darkMode, toggleDarkMode }}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthContext.Provider>
      </body>
    </html>
  );
}