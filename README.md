# المُعجم الشامل — Al-Mu'jam Al-Shamil

> **معجم عربي جامع للكلمات والمعاني والمرادفات والجذور واللهجات العربية المتنوعة**

المُعجم الشامل هو مشروع **مفتوح المصدر** يهدف إلى بناء قاموس عربي شامل يضم:
- معاني الكلمات العربية الفصحى والعامية
- المرادفات والأضداد
- جذور الكلمات
- **اللهجات العربية من كل البلدان** (سورية، مصرية، خليجية، مغاربية…)
- تسجيلات صوتية للنطق الصحيح مع بيانات جغرافية دقيقة

---

## ✨ الميزات

| الميزة | التوضيح |
|--------|---------|
| 🔍 **بحث عام** | أي زائر يبحث عن الكلمات ويشوف المعاني والتسجيلات |
| 🗣️ **تسجيلات صوتية** | كل كلمة جديدة لازم يرافقها مقطع صوتي للنطق — تسجيل مباشر من المتصفح |
| 🌍 **بيانات جغرافية دقيقة** | لغة، بلد، محافظة، مدينة، منطقة — لكل كلمة (متسلسل: بلد ← محافظة ← مدينة) |
| 👥 **مساهمات المستخدمين** | أي شخص مسجّل يقدر يضيف كلمات جديدة بسهولة |
| 🛂 **نظام إشراف** | المحتوى الجديد يمر بمراجعة قبل النشر (لوحة إشراف للمشرفين) |
| 🌗 **وضع ليلي/نهاري** | واجهة مريحة بالوضعين |
| 📖 **مفتوح المصدر** | كل شي public — الكود وقاعدة البيانات |

---

## 🏗️ التقنيات المستخدمة

| الطبقة | التقنية |
|--------|---------|
| **Frontend** | Next.js 14 + React 18 + Tailwind CSS 3 |
| **Backend** | Node.js + Express |
| **قاعدة بيانات** | PostgreSQL |
| **تخزين الصوت** | Cloudinary / S3 |
| **المصادقة** | JWT (JSON Web Tokens) |
| **الخطوط** | Noto Naskh Arabic + Amiri |

---

## 📁 هيكل المشروع الكامل

```
almujam-alshamil/
├── server/                    # Backend (Node.js + Express)
│   ├── index.js               # نقطة البداية
│   ├── routes/
│   │   ├── auth.js            # تسجيل + دخول (JWT)
│   │   ├── words.js           # إنشاء + عرض الكلمات
│   │   ├── moderation.js      # قبول/رفض المحتوى
│   │   └── search.js          # بحث + اقتراحات
│   ├── middleware/
│   │   └── auth.js            # middleware للتوثيق
│   └── config/
│       └── db.js              # اتصال PostgreSQL
├── frontend/                  # Frontend (Next.js)
│   ├── app/
│   │   ├── layout.js          # Navbar + Footer + AuthContext + Dark mode
│   │   ├── page.js            # الصفحة الرئيسية
│   │   ├── globals.css        # Tailwind + custom styles
│   │   ├── search/
│   │   │   ├── page.js        # صفحة البحث + الفلترة
│   │   │   └── [word]/
│   │   │       └── page.js    # تفاصيل الكلمة
│   │   ├── add/
│   │   │   └── page.js        # إضافة كلمة جديدة + تسجيل صوتي
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.js    # تسجيل الدخول
│   │   │   └── register/
│   │   │       └── page.js    # إنشاء حساب جديد
│   │   └── moderation/
│   │       └── page.js        # لوحة الإشراف (للمشرفين فقط)
│   ├── components/
│   │   ├── Navbar.js          # شريط التنقل
│   │   ├── Footer.js          # الفوتر
│   │   ├── SearchBar.js       # شريط بحث مع اقتراحات فورية
│   │   ├── WordCard.js        # بطاقة عرض الكلمة في نتائج البحث
│   │   ├── LocationPicker.js  # اختيار متسلسل: بلد → محافظة → مدينة (22 دولة)
│   │   └── AudioRecorder.js   # تسجيل صوتي مباشر من المايكروفون
│   └── lib/
│       └── api.js             # Axios client مع JWT interceptor
├── docs/
│   └── schema.sql             # PostgreSQL schema (5 جداول)
├── public/                    # Static assets
├── package.json               # Root package (server)
├── README.md
├── CONTRIBUTING.md
├── LICENSE                    # MIT
└── .env.example
```

---

## 🚀 كيف تشغّل المشروع

### 1. المتطلبات
- Node.js v18+
- PostgreSQL

### 2. الباك إند
```bash
cd server
npm install
npm run dev
```

### 3. الفرونت إند
```bash
cd frontend
npm install
npm run dev
```

### 4. قاعدة البيانات
```bash
# أنشئ قاعدة بيانات postgres و run:
psql -d almujam_shamil -f docs/schema.sql
```

---

## 🤝 المساهمة

نرحب بالجميع! راجع [CONTRIBUTING.md](CONTRIBUTING.md) للمساهمة.

---

## 📜 الترخيص

[MIT License](LICENSE)

---

**Made with ❤️ by Abd (@Abdomghrbi)**