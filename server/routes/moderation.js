const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET /api/moderation/pending — قائمة الكلمات المعلقة
router.get('/pending', authenticateToken, requireRole('moderator', 'admin'), async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(
      `SELECT w.*, l.country, l.state, l.city, l.district,
              u.username AS contributor_name
       FROM words w
       LEFT JOIN locations l ON w.location_id = l.id
       LEFT JOIN users u ON w.contributor_id = u.id
       WHERE w.status = 'pending'
       ORDER BY w.created_at DESC`
    );
    res.json({ words: result.rows });
  } catch (err) {
    console.error('Get pending error:', err);
    res.status(500).json({ error: 'خطأ في جلب الكلمات المعلقة' });
  }
});

// PUT /api/moderation/:id — قبول أو رفض كلمة
router.put('/:id', authenticateToken, requireRole('moderator', 'admin'), async (req, res) => {
  try {
    const { action, note } = req.body; // action: 'approve' أو 'reject'
    const pool = req.app.locals.pool;

    const status = action === 'approve' ? 'approved' : 'rejected';
    const approvedAt = action === 'approve' ? 'NOW()' : null;

    const result = await pool.query(
      `UPDATE words
       SET status = $1, moderator_id = $2, moderation_note = $3,
           approved_at = ${approvedAt ? 'NOW()' : 'NULL'}
       WHERE id = $4 AND status = 'pending'
       RETURNING id, word, status`,
      [status, req.user.id, note, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'الكلمة غير موجودة أو تمت مراجعتها مسبقاً' });
    }

    res.json({
      message: action === 'approve' ? 'تم قبول الكلمة' : 'تم رفض الكلمة',
      word: result.rows[0]
    });
  } catch (err) {
    console.error('Moderation error:', err);
    res.status(500).json({ error: 'خطأ في المراجعة' });
  }
});

module.exports = router;