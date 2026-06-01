const express = require('express');
const router = express.Router();

function buildSearchClauses({ q, country, type, language }) {
  const clauses = ["w.status = 'approved'"];
  const params = [];
  let i = 1;

  if (q) {
    clauses.push(`(
      w.word ILIKE $${i}
      OR w.meaning ILIKE $${i}
      OR COALESCE(w.example_usage, '') ILIKE $${i}
      OR COALESCE(w.root, '') ILIKE $${i}
      OR COALESCE(w.part_of_speech, '') ILIKE $${i}
      OR COALESCE(w.pronunciation, '') ILIKE $${i}
      OR COALESCE(w.language, '') ILIKE $${i}
      OR COALESCE(w.word_type, '') ILIKE $${i}
      OR COALESCE(l.country, '') ILIKE $${i}
      OR COALESCE(l.state, '') ILIKE $${i}
      OR COALESCE(l.district, '') ILIKE $${i}
    )`);
    params.push(`%${q}%`);
    i += 1;
  }

  if (country) {
    clauses.push(`l.country ILIKE $${i}`);
    params.push(country);
    i += 1;
  }

  if (type) {
    clauses.push(`w.word_type = $${i}`);
    params.push(type);
    i += 1;
  }

  if (language) {
    clauses.push(`w.language ILIKE $${i}`);
    params.push(language);
    i += 1;
  }

  return { whereSql: clauses.join(' AND '), params };
}

router.get('/', async (req, res) => {
  try {
    const { q, country, type, language } = req.query;
    const pool = req.app.locals.pool;

    const page = Math.max(parseInt(req.query.page || '1', 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const { whereSql, params } = buildSearchClauses({ q, country, type, language });

    const rowsResult = await pool.query(
      `
      SELECT
        w.id,
        w.word,
        w.slug,
        w.language,
        w.word_type,
        w.meaning,
        w.example_usage,
        w.root,
        w.part_of_speech,
        w.pronunciation,
        w.view_count,
        w.created_at,
        l.country,
        l.state,
        l.district,
        u.username AS contributor_name,
        EXISTS (
          SELECT 1
          FROM audio_clips ac
          WHERE ac.word_id = w.id
        ) AS has_audio,
        (
          SELECT ac.file_url
          FROM audio_clips ac
          WHERE ac.word_id = w.id
          ORDER BY ac.created_at ASC
          LIMIT 1
        ) AS audio_url
      FROM words w
      LEFT JOIN locations l ON w.location_id = l.id
      LEFT JOIN users u ON w.contributor_id = u.id
      WHERE ${whereSql}
      ORDER BY w.created_at DESC
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
      `,
      [...params, limit, offset]
    );

    const countResult = await pool.query(
      `
      SELECT COUNT(*) AS count
      FROM words w
      LEFT JOIN locations l ON w.location_id = l.id
      WHERE ${whereSql}
      `,
      params
    );

    const total = parseInt(countResult.rows[0].count, 10);

    res.json({
      words: rowsResult.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'خطأ في البحث' });
  }
});

router.get('/suggest', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const q = (req.query.q || '').trim();

    if (!q) {
      return res.json({ suggestions: [] });
    }

    const result = await pool.query(
      `
      SELECT
        w.word,
        w.slug,
        w.word_type,
        w.language,
        l.country
      FROM words w
      LEFT JOIN locations l ON w.location_id = l.id
      WHERE w.status = 'approved'
        AND (
          w.word ILIKE $1
          OR w.meaning ILIKE $1
          OR COALESCE(w.example_usage, '') ILIKE $1
          OR COALESCE(w.root, '') ILIKE $1
          OR COALESCE(w.language, '') ILIKE $1
        )
      ORDER BY w.view_count DESC, w.created_at DESC
      LIMIT 10
      `,
      [`%${q}%`]
    );

    res.json({ suggestions: result.rows });
  } catch (err) {
    console.error('Suggest error:', err);
    res.status(500).json({ suggestions: [] });
  }
});

module.exports = router;
