const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { q, country, type, page = 1, limit = 20 } = req.query;
    const pool = req.app.locals.pool;

    const offset = (page - 1) * limit;

    // ============================================
    // 1. Base Query (flat rows)
    // ============================================
    let baseQuery = `
      SELECT
        w.id,
        w.word,
        w.slug,
        w.word_type,
        w.root,
        w.meaning,
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

    const params = [];
    let i = 1;

    if (q) {
      baseQuery += ` AND (w.word ILIKE $${i} OR w.meaning ILIKE $${i})`;
      params.push(`%${q}%`);
      i++;
    }

    if (country) {
      baseQuery += ` AND l.country ILIKE $${i}`;
      params.push(country);
      i++;
    }

    if (type) {
      baseQuery += ` AND w.word_type = $${i}`;
      params.push(type);
      i++;
    }

    // ============================================
    // 2. Fetch all rows (for grouping)
    // ============================================
    const result = await pool.query(
      baseQuery + ` ORDER BY w.created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
      [...params, limit, offset]
    );

    // ============================================
    // 3. Grouping logic (IMPORTANT PART)
    // ============================================
    const map = new Map();

    for (const row of result.rows) {
      if (!map.has(row.word)) {
        map.set(row.word, {
          word: row.word,
          slug: row.slug,
          word_type: row.word_type,
          root: row.root,
          entries: [],
          contributors: new Set()
        });
      }

      const item = map.get(row.word);

      item.entries.push({
        id: row.id,
        meaning: row.meaning,
        country: row.country,
        state: row.state,
        city: row.city,
        district: row.district,
        created_at: row.created_at
      });

      if (row.contributor_name) {
        item.contributors.add(row.contributor_name);
      }
    }

    // convert Set → Array
    const words = Array.from(map.values()).map(w => ({
      ...w,
      contributors: Array.from(w.contributors)
    }));

    // ============================================
    // 4. Count query (same filters)
    // ============================================
    const countResult = await pool.query(
      `
      SELECT COUNT(*) FROM words w
      LEFT JOIN locations l ON w.location_id = l.id
      WHERE w.status = 'approved'
      ${q ? `AND (w.word ILIKE $1 OR w.meaning ILIKE $1)` : ''}
      ${country ? `AND l.country ILIKE $${q ? 2 : 1}` : ''}
      ${type ? `AND w.word_type = $${q && country ? 3 : q || country ? 2 : 1}` : ''}
      `,
      params.slice(0, q && country && type ? 3 : params.length)
    );

    const total = parseInt(countResult.rows[0].count);

    // ============================================
    // 5. Response
    // ============================================
    res.json({
      words,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });

  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'خطأ في البحث' });
  }
});

module.exports = router;
