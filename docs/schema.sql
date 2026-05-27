-- ============================================
-- المُعجم الشامل — قاعدة البيانات
-- Al-Mu'jam Al-Shamil Database Schema
-- ============================================

-- جدول المستخدمين
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المواقع الجغرافية
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  language VARCHAR(50) NOT NULL DEFAULT 'عربية',
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100),         -- محافظة/ولاية
  city VARCHAR(100),          -- مدينة
  district VARCHAR(100),      -- منطقة/حي
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (language, country, COALESCE(state,''), COALESCE(city,''), COALESCE(district,''))
);

-- جدول الكلمات
CREATE TABLE words (
  id SERIAL PRIMARY KEY,
  word VARCHAR(200) NOT NULL,              -- الكلمة
  slug VARCHAR(250) UNIQUE NOT NULL,       -- نسخة URL-friendly
  word_type VARCHAR(50) DEFAULT 'معنى',    -- معنى / مرادف / ضد / جذر / لهجة
  meaning TEXT NOT NULL,                    -- المعنى/الشرح
  root VARCHAR(50),                        -- الجذر (مثلاً: ك ت ب)
  part_of_speech VARCHAR(50),              -- اسم / فعل / حرف ...
  pronunciation TEXT,                      -- النطق بالأبجدية الصوتية (اختياري)
  contributor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  moderation_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول التسجيلات الصوتية
CREATE TABLE audio_clips (
  id SERIAL PRIMARY KEY,
  word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,                   -- رابط الملف الصوتي
  file_format VARCHAR(10) DEFAULT 'mp3',   -- mp3 / wav / ogg
  duration_seconds DECIMAL(5,2),
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المرادفات والعلاقات بين الكلمات
CREATE TABLE word_relations (
  id SERIAL PRIMARY KEY,
  word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  related_word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  relation_type VARCHAR(50) NOT NULL,       -- مرادف / ضد / مشتق / جذر_مشتق
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (word_id, related_word_id, relation_type),
  CHECK (word_id != related_word_id)
);

-- الفهارس
CREATE INDEX idx_words_word ON words(word);
CREATE INDEX idx_words_slug ON words(slug);
CREATE INDEX idx_words_status ON words(status);
CREATE INDEX idx_words_contributor ON words(contributor_id);
CREATE INDEX idx_audio_clips_word ON audio_clips(word_id);
CREATE INDEX idx_locations_country ON locations(country);
CREATE INDEX idx_word_relations_word ON word_relations(word_id);