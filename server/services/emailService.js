const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPasswordResetEmail(email, resetLink) {
  return await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'إعادة تعيين كلمة المرور',
    html: `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>إعادة تعيين كلمة المرور</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Tahoma,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:35px;text-align:center;">
              <h1 style="margin:0;color:white;font-size:28px;">
                المعجم الشامل
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 35px;">

              <h2 style="margin-top:0;color:#0f172a;">
                إعادة تعيين كلمة المرور
              </h2>

              <p style="color:#475569;line-height:1.9;">
                تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.
              </p>

              <p style="color:#475569;line-height:1.9;">
                اضغط على الزر التالي وتابع الخطوات لإنشاء كلمة مرور جديدة:
              </p>

              <div style="text-align:center;margin:35px 0;">
                <a
                  href="${resetLink}"
                  style="
                    display:inline-block;
                    background:#2563eb;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 32px;
                    border-radius:12px;
                    font-weight:bold;
                    font-size:16px;
                  "
                >
                  إعادة تعيين كلمة المرور
                </a>
              </div>

              <div style="
                background:#f8fafc;
                border:1px solid #e2e8f0;
                border-radius:12px;
                padding:15px;
                margin-top:20px;
              ">
                <p style="margin:0;color:#64748b;font-size:14px;line-height:1.8;">
                  ⏳ تنتهي صلاحية هذا الرابط خلال ساعة واحدة.
                </p>
              </div>

              <p style="margin-top:30px;color:#64748b;line-height:1.8;">
                إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان ولن يتم إجراء أي تغيير على حسابك.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              background:#f8fafc;
              border-top:1px solid #e2e8f0;
              padding:25px;
              text-align:center;
            ">
              <p style="margin:0;color:#94a3b8;font-size:13px;">
                © 2026 المعجم الشامل — جميع الحقوق محفوظة
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
  });
}

module.exports = {
  sendPasswordResetEmail
};
