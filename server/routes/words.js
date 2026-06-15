const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

/**
 * POST /api/words
 * إضافة كلمة جديدة (Entry-based system)
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      word,
      language,
      word_type,
      meaning,
      example_usage,
      root,
      part_of_speech,
      pronunciation,
      country,
      state,
      district,
      audioBase64
    } = req.body;

    const pool = req.app.locals.pool;

    // ============================================
    // 1. Validation أساسي
    // ============================================
    if (!word || !meaning || !country) {
      return res.status(400).json({
        error: 'word و meaning و country حقول مطلوبة'
      });
    }

    const normalizedWord = word.trim();
    const normalizedMeaning = meaning.trim();
    const normalizedLanguage = language?.trim() || 'العربية';
    const normalizedType = word_type || 'كلمة';
    const normalizedExample = example_usage?.trim() || null;

    // ============================================
    // 2. Get or Create Location
    // ============================================
    const locationResult = await pool.query(
      `
      SELECT id
      FROM locations
      WHERE country = $1
        AND COALESCE(state,'') = COALESCE($2,'')
        AND COALESCE(district,'') = COALESCE($3,'')
      LIMIT 1
      `,
      [
        country,
        state || null,
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
          district
        )
        VALUES ($1,$2,$3)
        RETURNING id
        `,
        [
          country,
          state || null,
          district || null
        ]
      );

      location_id = insertLocation.rows[0].id;
    }

    // ============================================
    // 3. Duplicate Check (Entry-level)
    // ============================================
    const duplicateCheck = await pool.query(
      `
      SELECT id
      FROM words
      WHERE LOWER(word) = LOWER($1)
        AND location_id = $2
        AND LOWER(meaning) = LOWER($3)
        AND word_type = $4
      LIMIT 1
      `,
      [
        normalizedWord,
        location_id,
        normalizedMeaning,
        normalizedType
      ]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({
        error: 'هذه الكلمة موجودة مسبقاً بنفس المعنى والموقع'
      });
    }

    // ============================================
    // 4. Slug Generation
    // ============================================
    const slugBase = normalizedWord
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF\s-]/g, '')
      .replace(/\s+/g, '-');

    const slug = `${slugBase}-${location_id}-${Date.now()}`;

    // ============================================
    // 5. Insert Word
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
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending')
      RETURNING
        id,
        word,
        slug,
        language,
        word_type,
        meaning,
        example_usage,
        root,
        part_of_speech,
        pronunciation,
        status,
        created_at
      `,
      [
        normalizedWord,
        slug,
        normalizedLanguage,
        normalizedType,
        normalizedMeaning,
        normalizedExample,
        root || null,
        part_of_speech || null,
        pronunciation || null,
        req.user.id,
        location_id
      ]
    );

    const createdWord = wordResult.rows[0];

    // ============================================
    // 6. Optional Audio
    // ============================================
    if (audioBase64) {
      const fileUrl = audioBase64.startsWith('data:')
        ? audioBase64
        : `data:audio/webm;base64,${audioBase64}`;

      await pool.query(
        `
        INSERT INTO audio_clips (
          word_id,
          file_url,
          file_format,
          uploaded_by
        )
        VALUES ($1,$2,'webm',$3)
        `,
        [createdWord.id, fileUrl, req.user.id]
      );
    }

    // ============================================
    // Response
    // ============================================
    res.status(201).json({
      message: 'تمت إضافة الكلمة بنجاح وهي قيد المراجعة',
      word: createdWord
    });

  } catch (err) {
    console.error('Add word error:', err);
    res.status(500).json({
      error: 'خطأ في إضافة الكلمة'
    });
  }
});

/**
 * GET /api/words/:id
 * جلب كلمة واحدة (by id, slug, or word)
 */
router.get('/:id', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const identifier = req.params.id;

    const result = await pool.query(
      `
      SELECT
  w.*,
  l.country,
  l.state,
  l.district,
  u.id AS contributor_id,           -- مرة واحدة بس
  u.username AS contributor_name,
  u.display_name AS contributor_display_name,
  u.avatar_url AS contributor_avatar,
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
LEFT JOIN users u ON w.contributor_id = u.id
LEFT JOIN locations l ON w.location_id = l.id
WHERE w.id::text = $1
   OR w.slug = $1
   OR LOWER(w.word) = LOWER($1)
ORDER BY w.created_at DESC
LIMIT 1
      `,
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'الكلمة غير موجودة'
      });
    }

    const audioResult = await pool.query(
      `
      SELECT
        id,
        file_url,
        file_format,
        duration_seconds,
        uploaded_by,
        created_at
      FROM audio_clips
      WHERE word_id = $1
      ORDER BY created_at ASC
      `,
      [result.rows[0].id]
    );

    res.json({
      word: result.rows[0],
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
