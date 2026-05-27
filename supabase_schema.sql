-- ============================================
-- المعجم الشامل — Full Database Schema
-- ============================================

-- 1. جدول المستخدمين
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user',
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. جدول المناطق (البلد/المحافظة/المدينة/المنطقة)
CREATE TABLE IF NOT EXISTS public.locations (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  country VARCHAR(100),
  state VARCHAR(100),
  city VARCHAR(100),
  district VARCHAR(100),
  type VARCHAR(50) DEFAULT 'city',
  parent_id INTEGER REFERENCES public.locations(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. جدول الكلمات
CREATE TABLE IF NOT EXISTS public.words (
  id SERIAL PRIMARY KEY,
  word VARCHAR(255) NOT NULL,
  normalized_word VARCHAR(255),
  word_type VARCHAR(50),
  meaning TEXT,
  root_letters VARCHAR(50),
  example_sentence TEXT,
  dialect VARCHAR(50) DEFAULT 'standard',
  location_id INTEGER REFERENCES public.locations(id) ON DELETE SET NULL,
  contributor_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending',
  verified_by INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. جدول التسجيلات الصوتية
CREATE TABLE IF NOT EXISTS public.audio_clips (
  id SERIAL PRIMARY KEY,
  word_id INTEGER NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  duration DOUBLE PRECISION,
  contributor_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
  dialect VARCHAR(50),
  location_id INTEGER REFERENCES public.locations(id) ON DELETE SET NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. جدول المفضلة
CREATE TABLE IF NOT EXISTS public.favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  word_id INTEGER NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

-- 6. جدول علاقات الكلمات (مرادفات، أضداد، الخ)
CREATE TABLE IF NOT EXISTS public.word_relations (
  id SERIAL PRIMARY KEY,
  word_id INTEGER NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  related_word_id INTEGER NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  relation_type VARCHAR(50) NOT NULL, -- synonym, antonym, root_derivative, etc
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. جدول سجل البحث
CREATE TABLE IF NOT EXISTS public.search_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  result_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- فهارس للأداء
-- ============================================
CREATE INDEX IF NOT EXISTS idx_words_word ON public.words(word);
CREATE INDEX IF NOT EXISTS idx_words_normalized ON public.words(normalized_word);
CREATE INDEX IF NOT EXISTS idx_words_type ON public.words(word_type);
CREATE INDEX IF NOT EXISTS idx_words_status ON public.words(status);
CREATE INDEX IF NOT EXISTS idx_words_dialect ON public.words(dialect);
CREATE INDEX IF NOT EXISTS idx_words_contributor ON public.words(contributor_id);
CREATE INDEX IF NOT EXISTS idx_audio_clips_word ON public.audio_clips(word_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_word ON public.favorites(word_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user ON public.search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_locations_parent ON public.locations(parent_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);