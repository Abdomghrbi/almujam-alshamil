const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// ============================================
// POST /api/words
// إضافة كلمة جديدة
// ============================================

router.post('/', authenticateToken, async (req, res) => {
try {
const {
word,
word_type,
meaning,
example_usage,
root,
part_of_speech,
pronunciation,
language,
country,
state,
city,
district,
audioBase64
} = req.body;

const pool = req.app.locals.pool;

// التحقق من الحقول المطلوبة
if (!word || !meaning || !country) {
  return res.status(400).json({
    error: 'الحقول word و meaning و country مطلوبة'
  });
}

// ============================================
// إيجاد أو إنشاء الموقع
// ============================================

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
// توليد slug
// ============================================

const slugBase = word.trim().replace(/\s+/g, '-').toLowerCase();

const slug = `${slugBase}-${location_id}-${Date.now()}`;

// ============================================
// إضافة الكلمة
// ============================================

const wordResult = await pool.query(
  `
  INSERT INTO words (
    word,
    slug,
    language,
    word_type,
    meaning,
    example_usage,
    root,
    part_of_speech,
    pronunciation,
    contributor_id,
    location_id,
    status
  )
  VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending'
  )
  RETURNING
    id,
    word,
    slug,
    language,
    word_type,
    meaning,
    example_usage,
    status,
    created_at
  `,
  [
    word,
    slug,
    language || 'العربية',
    word_type || 'كلمة',
    meaning,
    example_usage || null,
    root || null,
    part_of_speech || null,
    pronunciation || null,
    req.user.id,
    location_id
  ]
);

// ============================================
// حفظ التسجيل الصوتي إن وجد
// ============================================

if (audioBase64) {
  await pool.query(
    `
    INSERT INTO audio_clips (
      word_id,
      file_url,
      file_format
    )
    VALUES ($1,$2,'webm')
    `,
    [
      wordResult.rows[0].id,
      audioBase64
    ]
  );
}

res.status(201).json({
  message: 'تم إضافة الكلمة وهي قيد المراجعة',
  word: wordResult.rows[0]
});

} catch (err) {
console.error('Add word error:', err);

res.status(500).json({
  error: 'خطأ في إضافة الكلمة'
});

}
});

// ============================================
// GET /api/words/:id
// تفاصيل كلمة
// ============================================

router.get('/:id', async (req, res) => {
try {

const pool = req.app.locals.pool;

const result = await pool.query(
  `
  SELECT
    w.*,

    l.country,
    l.state,
    l.city,
    l.district,

    u.username AS contributor_name

  FROM words w

  LEFT JOIN locations l
    ON w.location_id = l.id

  LEFT JOIN users u
    ON w.contributor_id = u.id

  WHERE
    w.id = $1
    AND w.status = 'approved'
  `,
  [req.params.id]
);

if (result.rows.length === 0) {
  return res.status(404).json({
    error: 'الكلمة غير موجودة'
  });
}

// زيادة عدد المشاهدات
await pool.query(
  `
  UPDATE words
  SET view_count = view_count + 1
  WHERE id = $1
  `,
  [req.params.id]
);

// جلب التسجيلات الصوتية
const audioResult = await pool.query(
  `
  SELECT
    id,
    file_url,
    file_format,
    duration_seconds
  FROM audio_clips
  WHERE word_id = $1
  `,
  [req.params.id]
);

res.json({
  word: {
    ...result.rows[0],
    view_count:
      (result.rows[0].view_count || 0) + 1
  },
  audio_clips: audioResult.rows
});

} catch (err) {
console.error('Get word error:', err);

res.status(500).json({
  error: 'خطأ في جلب الكلمة'
});

}
});

module.exports = router;
