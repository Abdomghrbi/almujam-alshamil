const express = require('express');
const router = express.Router();

// GET /api/search?q=كلمة
router.get('/', async (req, res) => {
  try {
    const { q, country, type, page = 1, limit = 20 } = req.query;
    const pool = req.app.locals.pool;

    let query = `
      SELECT w.id, w.word, w.word_type, w.meaning,
             l.country, l.state, l.city,
             u.username AS contributor_name
      FROM words w
      LEFT JOIN locations l ON w.location_id = l.id
      LEFT JOIN users u ON w.contributor_id = u.id
      WHERE w.status = 'approved'
    `;
    const params = [];
    let paramIndex = 1;

    if (q) {
      query += ` AND (w.word ILIKE $${paramIndex} OR w.meaning ILIKE $${paramIndex})`;
      params.push(`%${q}%`);
      paramIndex++;
    }

    if (country) {
      query += ` AND l.country ILIKE $${paramIndex}`;
      params.push(country);
      paramIndex++;
    }

    if (type) {
      query += ` AND w.word_type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    // Count total
    const countResult = await pool.query(
      query.replace(/SELECT w\.id.*?FROM/, 'SELECT COUNT(*) FROM'),
      params
    );

    // Paginated results
    const offset = (page - 1) * limit;
    query += ` ORDER BY w.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      words: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'خطأ في البحث' });
  }
});

module.exports = router;
