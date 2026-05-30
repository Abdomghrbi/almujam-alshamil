let locationResult = await pool.query(
  `
  SELECT id
  FROM locations
  WHERE country = $1
    AND COALESCE(state,'') = COALESCE($2,'')
    AND COALESCE(city,'') = COALESCE($3,'')
    AND COALESCE(district,'') = COALESCE($4,'')
  LIMIT 1
  `,
  [
    country,
    state || null,
    city || null,
    district || null
  ]
);

let location_id;

// ============================================
// 1. Get or Create Location
// ============================================

if (locationResult.rows.length > 0) {
  location_id = locationResult.rows[0].id;
} else {
  const insertLocation = await pool.query(
    `
    INSERT INTO locations (
      country,
      state,
      city,
      district
    )
    VALUES ($1,$2,$3,$4)
    RETURNING id
    `,
    [
      country,
      state || null,
      city || null,
      district || null
    ]
  );

  location_id = insertLocation.rows[0].id;
}

// ============================================
// Normalize inputs (important)
// ============================================

const normalizedWord = word.trim();
const normalizedMeaning = meaning.trim();
const normalizedType = word_type || 'كلمة';

// تحسين slug (تنظيف كامل)
const slugBase = normalizedWord
  .toLowerCase()
  .replace(/[^\w\u0600-\u06FF\s-]/g, '') // حذف الرموز الغريبة
  .replace(/\s+/g, '-');

// ============================================
// 2. Duplicate Check (clean version)
// ============================================

const duplicateCheck = await pool.query(
  `
  SELECT id
  FROM words
  WHERE LOWER(word) = LOWER($1)
    AND location_id = $2
    AND LOWER(meaning) = LOWER($3)
    AND word_type = $4
  LIMIT 1
  `,
  [
    normalizedWord,
    location_id,
    normalizedMeaning,
    normalizedType
  ]
);

if (duplicateCheck.rows.length > 0) {
  return res.status(400).json({
    error: 'هذه الكلمة موجودة مسبقاً بنفس المعنى والموقع'
  });
}

// ============================================
// 3. Generate slug (Option A rule)
// ============================================

const slug = `${slugBase}-${location_id}-${Date.now()}`;

// ============================================
// 4. Insert word
// ============================================

const wordResult = await pool.query(
  `
  INSERT INTO words (
    word,
    slug,
    word_type,
    meaning,
    root,
    part_of_speech,
    pronunciation,
    contributor_id,
    location_id,
    status
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending')
  RETURNING id, word, slug, word_type, meaning, status, created_at
  `,
  [
    normalizedWord,
    slug,
    normalizedType,
    normalizedMeaning,
    root || null,
    part_of_speech || null,
    pronunciation || null,
    req.user.id,
    location_id
  ]
);
