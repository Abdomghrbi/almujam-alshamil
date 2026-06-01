const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.pool;

    const result = await pool.query(`
      WITH approved_words AS (
        SELECT id, contributor_id, location_id
        FROM words
        WHERE status = 'approved'
      )
      SELECT
        (SELECT COUNT(*) FROM approved_words) AS approved_words,
        (SELECT COUNT(*) FROM audio_clips ac
          INNER JOIN approved_words aw ON aw.id = ac.word_id
        ) AS audio_clips,
        (SELECT COUNT(DISTINCT location_id)
          FROM approved_words
          WHERE location_id IS NOT NULL
        ) AS locations_covered,
        (SELECT COUNT(DISTINCT contributor_id)
          FROM approved_words
          WHERE contributor_id IS NOT NULL
        ) AS contributors,
        (SELECT COUNT(*) FROM words WHERE status = 'pending') AS pending_words
    `);

    const row = result.rows[0] || {};

    res.set('Cache-Control', 'no-store');
    res.json({
      approvedWords: Number(row.approved_words || 0),
      audioClips: Number(row.audio_clips || 0),
      locationsCovered: Number(row.locations_covered || 0),
      contributors: Number(row.contributors || 0),
      pendingWords: Number(row.pending_words || 0),
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'خطأ في جلب الإحصائيات' });
  }
});

module.exports = router;
