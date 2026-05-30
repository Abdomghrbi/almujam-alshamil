const express = require('express');
const router = express.Router();

/**

* GET /api/search
* بحث مع تجميع النتائج حسب الكلمة
  */

router.get('/', async (req, res) => {
try {
const {
q,
country,
language,
type,
page = 1,
limit = 20
} = req.query;

const pool = req.app.locals.pool;

const params = [];
let paramIndex = 1;

// ============================================
// الاستعلام الأساسي (Flat Results)
// ============================================

let query = `
  SELECT
    w.id,
    w.word,
    w.slug,
    w.language,
    w.word_type,
    w.meaning,
    w.example_usage,
    w.view_count,
    w.created_at,

    l.country,
    l.state,
    l.city,
    l.district,

    u.username AS contributor_name

  FROM words w
  LEFT JOIN locations l ON w.location_id = l.id
  LEFT JOIN users u ON w.contributor_id = u.id
  WHERE w.status = 'approved'
`;

// ============================================
// البحث النصي
// ============================================

if (q) {
  query += `
    AND (
      w.word ILIKE $${paramIndex}
      OR w.meaning ILIKE $${paramIndex}
      OR w.example_usage ILIKE $${paramIndex}
    )
  `;
  params.push(`%${q}%`);
  paramIndex++;
}

// ============================================
// فلترة الدولة
// ============================================

if (country) {
  query += `
    AND l.country ILIKE $${paramIndex}
  `;
  params.push(country);
  paramIndex++;
}

// ============================================
// فلترة اللغة
// ============================================

if (language) {
  query += `
    AND w.language ILIKE $${paramIndex}
  `;
  params.push(language);
  paramIndex++;
}

// ============================================
// فلترة النوع
// ============================================

if (type) {
  query += `
    AND w.word_type = $${paramIndex}
  `;
  params.push(type);
  paramIndex++;
}

// ============================================
// جلب كل النتائج (بدون pagination قبل التجميع)
// ============================================

const result = await pool.query(query, params);
const rows = result.rows;

// ============================================
// تجميع النتائج حسب الكلمة
// ============================================

const grouped = {};

for (const row of rows) {
  if (!grouped[row.word]) {
    grouped[row.word] = {
      word: row.word,
      slug: row.slug,
      language: row.language,
      word_type: row.word_type,
      view_count: row.view_count,
      created_at: row.created_at,
      example_usage: row.example_usage,
      entries: []
    };
  }

  grouped[row.word].entries.push({
    country: row.country,
    state: row.state,
    city: row.city,
    district: row.district,
    meaning: row.meaning
  });
}

const groupedArray = Object.values(grouped);

// ============================================
// Pagination بعد التجميع
// ============================================

const pageInt = parseInt(page);
const limitInt = parseInt(limit);

const offset = (pageInt - 1) * limitInt;

const paginated = groupedArray.slice(
  offset,
  offset + limitInt
);

// ============================================
// Response
// ============================================

res.json({
  words: paginated,
  total: groupedArray.length,
  page: pageInt,
  totalPages: Math.ceil(groupedArray.length / limitInt)
});

} catch (err) {
console.error('Search error:', err);
res.status(500).json({
error: 'خطأ في البحث'
});
}
});

module.exports = router;
