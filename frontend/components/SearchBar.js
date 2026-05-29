'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ initialQuery = '', onSearch }) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef();
  const debounceRef = useRef();

  useEffect(() => {
    if (query.length >= 2) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://almujam-alshamil-api.onrender.com'}/api/search/suggest?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setSuggestions(data.suggestions || []);
          setShowSuggestions(true);
        } catch (err) {
          // ignore
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <Search size={20} className="text-surface-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="ابحث عن كلمة…"
          className="w-full pr-12 pl-12 py-3.5 rounded-2xl border-2 border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-800 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-lg"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); inputRef.current?.focus(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 transition-all"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden z-50">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSuggestionClick(s.word || s)}
              className="w-full text-right px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors border-b border-surface-100 dark:border-surface-700 last:border-0"
            >
              <span className="font-medium text-surface-800 dark:text-white">{s.word || s}</span>
              {s.type && <span className="badge-primary mr-2 text-xs">{s.type}</span>}
              {s.country && <span className="text-xs text-surface-400 mr-2">📌 {s.country}</span>}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
