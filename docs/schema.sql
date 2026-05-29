-- ============================================
-- المُعجم الشامل — قاعدة البيانات
-- Al-Mu'jam Al-Shamil Database Schema
-- ============================================

-- 1. جدول المستخدمين
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. جدول المواقع الجغرافية
CREATE TABLE IF NOT EXISTS public.locations (
  id SERIAL PRIMARY KEY,
  language VARCHAR(50) NOT NULL DEFAULT 'العربية',
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  city VARCHAR(100),
  district VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_locations_unique
  ON public.locations (language, country, COALESCE(state,''), COALESCE(city,''), COALESCE(district,''));

-- 3. جدول الكلمات
CREATE TABLE IF NOT EXISTS public.words (
  id SERIAL PRIMARY KEY,
  word VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  word_type VARCHAR(50) DEFAULT 'معنى',
  meaning TEXT NOT NULL,
  root VARCHAR(50),
  part_of_speech VARCHAR(50),
  pronunciation TEXT,
  contributor_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
  location_id INTEGER REFERENCES public.locations(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderator_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
  moderation_note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. جدول التسجيلات الصوتية
CREATE TABLE IF NOT EXISTS public.audio_clips (
  id SERIAL PRIMARY KEY,
  word_id INTEGER NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_format VARCHAR(10) DEFAULT 'mp3',
  duration_seconds DECIMAL(5,2),
  uploaded_by INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. جدول المرادفات والعلاقات بين الكلمات
CREATE TABLE IF NOT EXISTS public.word_relations (
  id SERIAL PRIMARY KEY,
  word_id INTEGER NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  related_word_id INTEGER NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  relation_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (word_id, related_word_id, relation_type),
  CHECK (word_id != related_word_id)
);

-- ============================================
-- فهارس للأداء
-- ============================================
CREATE INDEX IF NOT EXISTS idx_words_word ON public.words(word);
CREATE INDEX IF NOT EXISTS idx_words_slug ON public.words(slug);
CREATE INDEX IF NOT EXISTS idx_words_type ON public.words(word_type);
CREATE INDEX IF NOT EXISTS idx_words_status ON public.words(status);
CREATE INDEX IF NOT EXISTS idx_words_contributor ON public.words(contributor_id);
CREATE INDEX IF NOT EXISTS idx_audio_clips_word ON public.audio_clips(word_id);
CREATE INDEX IF NOT EXISTS idx_locations_country ON public.locations(country);
CREATE INDEX IF NOT EXISTS idx_word_relations_word ON public.word_relations(word_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
