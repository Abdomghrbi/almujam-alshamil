const express = require('express');
const router = express.Router();

// ===================================
// GET /api/search
// ===================================

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

  LEFT JOIN locations l
    ON w.location_id = l.id

  LEFT JOIN users u
    ON w.contributor_id = u.id

  WHERE w.status = 'approved'
`;

const params = [];
let paramIndex = 1;

// ===================================
// البحث بالكلمة أو المعنى أو المثال
// ===================================

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

// ===================================
// فلترة الدولة
// ===================================

if (country) {
  query += `
    AND l.country ILIKE $${paramIndex}
  `;

  params.push(country);
  paramIndex++;
}

// ===================================
// فلترة اللغة
// ===================================

if (language) {
  query += `
    AND w.language ILIKE $${paramIndex}
  `;

  params.push(language);
  paramIndex++;
}

// ===================================
// فلترة النوع
// ===================================

if (type) {
  query += `
    AND w.word_type = $${paramIndex}
  `;

  params.push(type);
  paramIndex++;
}

// ===================================
// عدد النتائج
// ===================================

const countQuery = `
  SELECT COUNT(*) AS count
  FROM (
    ${query}
  ) AS filtered_results
`;

const countResult = await pool.query(
  countQuery,
  params
);

// ===================================
// Pagination
// ===================================

const offset =
  (parseInt(page) - 1) *
  parseInt(limit);

query += `
  ORDER BY
    w.view_count DESC,
    w.created_at DESC

  LIMIT $${paramIndex}
  OFFSET $${paramIndex + 1}
`;

params.push(
  parseInt(limit),
  offset
);

const result = await pool.query(
  query,
  params
);

const total =
  parseInt(
    countResult.rows[0].count
  );

res.json({
  words: result.rows,
  total,
  page: parseInt(page),
  totalPages: Math.ceil(
    total / parseInt(limit)
  )
});

} catch (err) {

console.error(
  'Search error:',
  err
);

res.status(500).json({
  error: 'خطأ في البحث'
});

}
});

module.exports = router;
