-- ============================================
-- المُعجم الشامل v-0.2.0
-- ============================================

-- ============================================
-- USERS
-- ============================================

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,

    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,

    role VARCHAR(20) NOT NULL DEFAULT 'user'
        CHECK (role IN ('user','moderator','admin')),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- LOCATIONS
-- ============================================

CREATE TABLE public.locations (
    id SERIAL PRIMARY KEY,

    country VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_locations_unique
ON public.locations (
    country,
    COALESCE(state,''),
    COALESCE(city,''),
    COALESCE(district,'')
);

-- ============================================
-- WORDS
-- ============================================

CREATE TABLE public.words (
    id SERIAL PRIMARY KEY,

    word VARCHAR(200) NOT NULL,

    slug VARCHAR(250) UNIQUE NOT NULL,

    language VARCHAR(50) NOT NULL DEFAULT 'العربية',

    word_type VARCHAR(50) NOT NULL
        CHECK (
            word_type IN (
                'كلمة',
                'مثل',
                'تعبير',
                'مصطلح',
                'كنية'
            )
        ),

    meaning TEXT NOT NULL,

    example_usage TEXT,

    root VARCHAR(50),

    part_of_speech VARCHAR(50),

    pronunciation TEXT,

    view_count INTEGER NOT NULL DEFAULT 0,

    contributor_id INTEGER
        REFERENCES public.users(id)
        ON DELETE SET NULL,

    location_id INTEGER
        REFERENCES public.locations(id)
        ON DELETE SET NULL,

    status VARCHAR(20) DEFAULT 'pending'
        CHECK (
            status IN (
                'pending',
                'approved',
                'rejected'
            )
        ),

    moderator_id INTEGER
        REFERENCES public.users(id)
        ON DELETE SET NULL,

    moderation_note TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    approved_at TIMESTAMP,

    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- AUDIO CLIPS
-- ============================================

CREATE TABLE public.audio_clips (
    id SERIAL PRIMARY KEY,

    word_id INTEGER NOT NULL
        REFERENCES public.words(id)
        ON DELETE CASCADE,

    file_url TEXT NOT NULL,

    file_format VARCHAR(20) DEFAULT 'mp3',

    duration_seconds DECIMAL(6,2),

    uploaded_by INTEGER
        REFERENCES public.users(id)
        ON DELETE SET NULL,

    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- WORD RELATIONS
-- ============================================

CREATE TABLE public.word_relations (
    id SERIAL PRIMARY KEY,

    word_id INTEGER NOT NULL
        REFERENCES public.words(id)
        ON DELETE CASCADE,

    related_word_id INTEGER NOT NULL
        REFERENCES public.words(id)
        ON DELETE CASCADE,

    relation_type VARCHAR(30) NOT NULL
        CHECK (
            relation_type IN (
                'synonym',
                'antonym',
                'variant',
                'derived'
            )
        ),

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (
        word_id,
        related_word_id,
        relation_type
    ),

    CHECK (
        word_id <> related_word_id
    )
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_words_word
ON public.words(word);

CREATE INDEX idx_words_status
ON public.words(status);

CREATE INDEX idx_words_type
ON public.words(word_type);

CREATE INDEX idx_words_language
ON public.words(language);

CREATE INDEX idx_words_location
ON public.words(location_id);

CREATE INDEX idx_words_contributor
ON public.words(contributor_id);

CREATE INDEX idx_words_view_count
ON public.words(view_count);

CREATE INDEX idx_audio_word
ON public.audio_clips(word_id);

CREATE INDEX idx_locations_country
ON public.locations(country);

CREATE INDEX idx_word_relations_word
ON public.word_relations(word_id);

CREATE INDEX idx_users_username
ON public.users(username);

CREATE INDEX idx_users_email
ON public.users(email);
