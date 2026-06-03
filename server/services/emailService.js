const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPasswordResetEmail(email, resetLink) {
  return await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'إعادة تعيين كلمة المرور',
    html: `
      <div dir="rtl" style="font-family: sans-serif">
        <h2>إعادة تعيين كلمة المرور</h2>

        <p>
          تم طلب إعادة تعيين كلمة المرور الخاصة بحسابك.
        </p>

        <p>
          اضغط على الرابط التالي:
        </p>

        <p>
          <a href="${resetLink}">
            إعادة تعيين كلمة المرور
          </a>
        </p>

        <p>
          إذا لم تطلب ذلك، تجاهل هذه الرسالة.
        </p>
      </div>
    `
  });
}

module.exports = {
  sendPasswordResetEmail
};
