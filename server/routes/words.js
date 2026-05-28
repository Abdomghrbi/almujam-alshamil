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
      country = '',
      state = '',
      city = '',
      district = ''
    } = req.body;

    // التحقق من القيم الأساسية
    if (!word || !meaning || !language) {
      return res.status(400).json({ error: 'المعطيات الأساسية مطلوبة' });
    }

    const pool = req.app.locals.pool;

    // معالجة القيم لضمان عدم وجود null
    const cleanCountry = country !== null && country !== undefined ? country : '';
    const cleanState = state !== null && state !== undefined ? state : '';
    const cleanCity = city !== null && city !== undefined ? city : '';
    const cleanDistrict = district !== null && district !== undefined ? district : '';

    // 1. إضافة أو إيجاد الموقع الجغرافي
    const locationResult = await pool.query(
      `INSERT INTO locations (language, country, state, city, district)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (language, COALESCE(country,''), COALESCE(state,''), COALESCE(city,''), COALESCE(district,''))
       DO UPDATE SET language = EXCLUDED.language
       RETURNING id`,
      [language || 'عربية', cleanCountry, cleanState, cleanCity, cleanDistrict]
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
