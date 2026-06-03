const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPasswordResetEmail(email, resetLink) {
  return await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'إعادة تعيين كلمة المرور',
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">
  <h2>المعجم الشامل</h2>

  <p>مرحباً،</p>

  <p>
    تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.
  </p>

  <p style="text-align:center;margin:30px 0">
    <a
      href="${resetLink}"
      style="
        background:#2563eb;
        color:white;
        padding:12px 24px;
        text-decoration:none;
        border-radius:8px;
        display:inline-block;
      "
    >
      إعادة تعيين كلمة المرور
    </a>
  </p>

  <p>
    تنتهي صلاحية هذا الرابط خلال ساعة واحدة.
  </p>

  <p>
    إذا لم تطلب إعادة تعيين كلمة المرور يمكنك تجاهل هذه الرسالة.
  </p>

  <hr>

  <small>
    © المعجم الشامل
  </small>
</div>
`
  });
}

module.exports = {
  sendPasswordResetEmail
};
