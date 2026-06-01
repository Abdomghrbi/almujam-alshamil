const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');

// ============================================
// GET pending words
// ============================================

router.get(
  '/pending',
  authenticateToken,
  requireRole('moderator', 'admin'),
  async (req, res) => {
    try {
      const pool = req.app.locals.pool;

      const result = await pool.query(
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
          w.status,
          w.created_at,

          l.country,
          l.state,
          l.district,

          u.username AS contributor_name,
          EXISTS (
            SELECT 1
            FROM audio_clips ac
            WHERE ac.word_id = w.id
          ) AS has_audio

        FROM words w
        LEFT JOIN locations l ON w.location_id = l.id
        LEFT JOIN users u ON w.contributor_id = u.id

        WHERE w.status = 'pending'

        ORDER BY w.created_at DESC
        `
      );

      res.json({
        words: result.rows
      });

    } catch (err) {
      console.error('Get pending error:', err);
      res.status(500).json({
        error: 'خطأ في جلب الكلمات المعلقة'
      });
    }
  }
);

// ============================================
// Approve / Reject word
// ============================================

router.put(
  '/:id',
  authenticateToken,
  requireRole('moderator', 'admin'),
  async (req, res) => {
    try {
      const { action, note } = req.body;
      const pool = req.app.locals.pool;

      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({
          error: 'action يجب أن تكون approve أو reject'
        });
      }

      const status =
        action === 'approve'
          ? 'approved'
          : 'rejected';

      const approvedAt =
        action === 'approve'
          ? new Date()
          : null;

      const result = await pool.query(
        `
        UPDATE words
        SET
          status = $1,
          moderator_id = $2,
          moderation_note = $3,
          approved_at = $4
        WHERE
          id = $5
          AND status = 'pending'
        RETURNING
          id,
          word,
          status
        `,
        [
          status,
          req.user.id,
          note || null,
          approvedAt,
          req.params.id
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: 'الكلمة غير موجودة أو تمت مراجعتها مسبقاً'
        });
      }

      res.json({
        message:
          action === 'approve'
            ? 'تم قبول الكلمة'
            : 'تم رفض الكلمة',
        word: result.rows[0]
      });

    } catch (err) {
      console.error('Moderation error:', err);

      res.status(500).json({
        error: 'خطأ في المراجعة'
      });
    }
  }
);

module.exports = router;
