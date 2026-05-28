'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '../../components/SearchBar';
import WordCard from '../../components/WordCard';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    country: '',
    dialect: '',
    type: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ q: query });
      if (filters.country) params.append('country', filters.country);
      if (filters.dialect) params.append('dialect', filters.dialect);
      if (filters.type) params.append('type', filters.type);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://almujam-alshamil-api.onrender.com'}/api/search?${params}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (q) => {
    setQuery(q);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const countries = ['سوريا', 'العراق', 'السعودية', 'مصر', 'الأردن', 'لبنان', 'فلسطين', 'اليمن', 'عمان', 'الإمارات', 'قطر', 'البحرين', 'الكويت', 'ليبيا', 'تونس', 'الجزائر', 'المغرب', 'موريتانيا', 'السودان', 'الصومال', 'جيبوتي', 'جزر القمر'];
  const types = ['معنى', 'مرادف', 'جذر', 'لهجة محلية'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
        <Search size={24} className="inline ml-2 text-primary-500" />
        البحث في المعجم
      </h1>

      <SearchBar initialQuery={query} onSearch={handleSearch} />

      <div className="flex items-center justify-between mt-6 mb-4">
        <div className="text-sm text-surface-500">
          {loading ? 'جارٍ البحث…' : results.length > 0 ? `تم العثور على ${results.length} نتيجة` : ''}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-all text-sm"
        >
          <SlidersHorizontal size={16} />
          فلترة
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-surface-700 dark:text-surface-300">خيارات الفلترة</h3>
            <button onClick={() => setShowFilters(false)} className="text-surface-400 hover:text-surface-600">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1.5">البلد</label>
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="input-field"
              >
                <option value="">كل البلدان</option>
                {countries.sort().map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1.5">النوع</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="input-field"
              >
                <option value="">الكل</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setFilters({ country: '', dialect: '', type: '' }); }}
                className="btn-outline !py-2.5 !text-sm w-full"
              >
                إعادة تعيين
              </button>
            </div>
          </div>
          <button onClick={performSearch} className="btn-primary w-full mt-4 !py-2.5">
            <Filter size={16} className="inline ml-1" /> تطبيق الفلترة
          </button>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4 mt-4">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-surface-500">جاري البحث…</p>
          </div>
        ) : results.length > 0 ? (
          results.map((word, i) => <WordCard key={i} word={word} />)
        ) : query ? (
          <div className="text-center py-16">
            <Search size={48} className="mx-auto mb-4 text-surface-300" />
            <p className="text-surface-500 text-lg">لم نعثر على نتائج لـ "{query}"</p>
            <p className="text-surface-400 text-sm mt-2">جرّب كلمة أخرى أو أضفها إلى المعجم</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen size={48} className="mx-auto mb-4 text-surface-300" />
            <p className="text-surface-500 text-lg">ابدأ بكتابة كلمة في خانة البحث</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BookOpen(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}
