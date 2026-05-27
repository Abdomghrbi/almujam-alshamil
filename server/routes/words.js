const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// POST /api/words — إضافة كلمة جديدة
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      word,
      word_type,
      meaning,
      root,
      part_of_speech,
      pronunciation,
      language,
      country,
      state,
      city,
      district
    } = req.body;

    const pool = req.app.locals.pool;

    // 1. إضافة أو إيجاد الموقع الجغرافي
    const locationResult = await pool.query(
      `INSERT INTO locations (language, country, state, city, district)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (language, country, COALESCE(state,''), COALESCE(city,''), COALESCE(district,''))
       DO UPDATE SET language = EXCLUDED.language
       RETURNING id`,
      [language || 'عربية', country, state, city, district]
    );
    const location_id = locationResult.rows[0].id;

    // 2. توليد slug
    const slug = word.trim().replace(/\s+/g, '-').toLowerCase() + '-' + Date.now();

    // 3. إدراج الكلمة (بـ status = pending)
    const wordResult = await pool.query(
      `INSERT INTO words (word, slug, word_type, meaning, root, part_of_speech, pronunciation, contributor_id, location_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
       RETURNING id, word, slug, word_type, meaning, status, created_at`,
      [word, slug, word_type || 'معنى', meaning, root, part_of_speech, pronunciation, req.user.id, location_id]
    );

    res.status(201).json({
      message: 'تم إضافة الكلمة وهي قيد المراجعة',
      word: wordResult.rows[0]
    });
  } catch (err) {
    console.error('Add word error:', err);
    res.status(500).json({ error: 'خطأ في إضافة الكلمة' });
  }
});

// GET /api/words/:id — تفاصيل كلمة
router.get('/:id', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(
      `SELECT w.*, 
              l.language, l.country, l.state, l.city, l.district,
              u.username AS contributor_name
       FROM words w
       LEFT JOIN locations l ON w.location_id = l.id
       LEFT JOIN users u ON w.contributor_id = u.id
       WHERE w.id = $1 AND w.status = 'approved'`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'الكلمة غير موجودة' });
    }

    // جلب التسجيلات الصوتية
    const audioResult = await pool.query(
      'SELECT id, file_url, file_format, duration_seconds FROM audio_clips WHERE word_id = $1',
      [req.params.id]
    );

    res.json({
      word: result.rows[0],
      audio_clips: audioResult.rows
    });
  } catch (err) {
    console.error('Get word error:', err);
    res.status(500).json({ error: 'خطأ في جلب الكلمة' });
  }
});

module.exports = router;