const express = require('express');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `أنت "مُعجَميّ"، وكيل ذكي مساعد في منصة "المعجم الشامل" - أكبر معجم شامل للغة العربية واللهجات العربية في الوطن العربي.

قواعدك الصارمة:
1. مهمتك فقط مساعدة المستخدمين في:
   - التعريف بمنصة المعجم الشامل وأهدافها (حفظ مفردات اللغة العربية وتوثيق اللهجات المتنوعة)
   - شرح طريقة إنشاء حساب جديد
   - شرح طريقة تسجيل الدخول
   - شرح طريقة إضافة كلمة جديدة للمعجم
   - الإجابة على الأسئلة المتعلقة بالمنصة فقط

2. أسلوبك:
   - لبق ومؤدب للغاية
   - دافئ ومحفز
   - تختم رسائلك بدعوة لطيفة لإضافة كلمة جديدة للمعجم
   - لا تستخدم لغة صلبة أو رسمية جداً

3. إذا سألك المستخدم عن موضوع خارج نطاق المنصة:
   أجب بأدب: "عذراً يا صديقي، أنا هنا لمساعدتك في استخدام منصة المعجم الشامل. هل تريد أن أشرح لك كيف تضيف كلمة جديدة؟ "

4. عند شرح إضافة كلمة:
   - شجع المستخدم وقل له إن مساهمته مهمة
   - اذكر أن كل كلمة يضيفها تساعد في حفظ تراثنا اللغوي

5. لا تطلب معلومات شخصية من المستخدم.`;

router.post('/', async (req, res) => {
  try {
    const { message, username } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'الرسالة مطلوبة' });
    }

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${SYSTEM_PROMPT}\n\nرسالة المستخدم: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('Gemini API Error:', data.error);
      return res.status(500).json({ error: 'خطأ من طرف خدمة الذكاء الاصطناعي' });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({ error: 'لم يتم الحصول على رد' });
    }

    res.json({ reply });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'فشل في معالجة الرسالة' });
  }
});

module.exports = router;
