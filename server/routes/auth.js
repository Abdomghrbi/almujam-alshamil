const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing in environment variables');
}

const JWT_SECRET = process.env.JWT_SECRET;

// ============================================
// REGISTER
// ============================================

router.post('/register', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      display_name
    } = req.body;

    const pool = req.app.locals.pool;

    // Validation أساسي
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'جميع الحقول مطلوبة'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
      });
    }

    // Check existing user
    const existing = await pool.query(
      `
      SELECT id
      FROM users
      WHERE username = $1 OR email = $2
      `,
      [username, email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        error: 'اسم المستخدم أو البريد موجود مسبقاً'
      });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `
      INSERT INTO users (
        username,
        email,
        password_hash,
        display_name
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        username,
        email,
        display_name,
        role,
        created_at
      `,
      [
        username,
        email,
        password_hash,
        display_name || username
      ]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user,
      token
    });

  } catch (err) {
    console.error('Register error:', err);

    res.status(500).json({
      error: 'خطأ في التسجيل'
    });
  }
});

// ============================================
// LOGIN
// ============================================

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const pool = req.app.locals.pool;

    if (!username || !password) {
      return res.status(400).json({
        error: 'جميع الحقول مطلوبة'
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        username,
        email,
        password_hash,
        display_name,
        role
      FROM users
      WHERE username = $1 OR email = $1
      LIMIT 1
      `,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'اسم المستخدم أو كلمة المرور خطأ'
      });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!valid) {
      return res.status(401).json({
        error: 'اسم المستخدم أو كلمة المرور خطأ'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        display_name: user.display_name,
        role: user.role
      },
      token
    });

  } catch (err) {
    console.error('Login error:', err);

    res.status(500).json({
      error: 'خطأ في تسجيل الدخول'
    });
  }
});

// ============================================
// CURRENT USER
// ============================================

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const pool = req.app.locals.pool;

    const result = await pool.query(
      `
      SELECT
        id,
        username,
        email,
        display_name,
        bio,
        avatar_url,
        role,
        is_active,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'خطأ في جلب بيانات المستخدم' });
  }
});

module.exports = router;
