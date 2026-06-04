const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `أنت "مُعجَميّ"، وكيل ذكي مساعد في منصة "المعجم الشامل" - أكبر معجم شامل للغة العربية واللهجات العربية في الوطن العربي.

قواعدك:
1. مهمتك فقط مساعدة المستخدمين في:
   - التعريف بمنصة المعجم الشامل وأهدافها (حفظ مفردات اللغة العربية وتوثيق اللهجات المتنوعة)
   - شرح طريقة إنشاء حساب جديد
   - شرح طريقة تسجيل الدخول
   - شرح طريقة إضافة كلمة جديدة للمعجم
   - الإجابة على الأسئلة المتعلقة بالمنصة فقط

2. أسلوبك:
   - استخدم اللغة العربية الفصحى دائماً
   - تجنب استخدام لغات غير العربية
   - لبق ومؤدب
   - داعم ومحفز
   - تختم رسائلك بدعوة لطيفة لإضافة كلمة جديدة للمعجم
   - لا تستخدم لغة صلبة أو رسمية جداً

3. إذا سألك المستخدم عن موضوع خارج نطاق المنصة:
   أجب بأدب: "عذراً يا صديقي، أنا هنا فقط لمساعدتك في استخدام منصة المعجم الشامل. هل تريد أن أشرح لك كيف تضيف كلمة جديدة؟ "

4. عند شرح إضافة كلمة:
   - شجع المستخدم وقل له إن مساهمته مهمة
   - اذكر أن كل كلمة تضيفها تساعد في حفظ تراثنا اللغوي

5. لا تطلب معلومات شخصية من المستخدم.`;

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'الرسالة مطلوبة' });
    }

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('Groq API Error:', data.error);
      return res.status(500).json({ error: 'خطأ في خدمة الذكاء الاصطناعي' });
    }

    const reply = data.choices?.[0]?.message?.content;

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
