const nodemailer = require("nodemailer");

// nodemailer transport setup (checks SMTP env values)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || ""
  }
});

// Reusable helper supporting Vercel Email API proxy (works on Render) and SMTP (for local dev)
const sendEmail = async (to, subject, html, attachments = []) => {
  const emailApiSecret = process.env.EMAIL_API_SECRET;
  const clientUrl = process.env.CLIENT_URL;
  const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER;

  if (emailApiSecret && clientUrl) {
    try {
      // Clean trailing slash from clientUrl if present
      const baseUrl = clientUrl.endsWith("/") ? clientUrl.slice(0, -1) : clientUrl;
      const response = await fetch(`${baseUrl}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-email-api-secret": emailApiSecret
        },
        body: JSON.stringify({ to, subject, html })
      });

      if (response.ok) {
        console.log(`[Vercel API Email] Email sent successfully to ${to}`);
        return true;
      } else {
        const errText = await response.text();
        console.error(`[Vercel API Email] Failed to send to ${to}:`, errText);
        // Fallback to local SMTP if configured (useful for local development)
        if (smtpConfigured && process.env.NODE_ENV !== "production") {
          return await sendEmailSMTP(to, subject, html, attachments);
        }
        return false;
      }
    } catch (err) {
      console.error(`[Vercel API Email] Error sending to ${to}:`, err.message);
      if (smtpConfigured && process.env.NODE_ENV !== "production") {
        return await sendEmailSMTP(to, subject, html, attachments);
      }
      return false;
    }
  } else if (smtpConfigured) {
    return await sendEmailSMTP(to, subject, html, attachments);
  } else {
    console.log(`[Email Skipped] No email provider configured (to: ${to}, subject: ${subject})`);
    return false;
  }
};

// Extracted SMTP sender logic
const sendEmailSMTP = async (to, subject, html, attachments = []) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || `"ARAQ Herbal" <hello@araqherbal.com>`,
      to,
      subject,
      html,
      attachments
    };
    await transporter.sendMail(mailOptions);
    console.log(`[SMTP Email] Email sent successfully to ${to}`);
    return true;
  } catch (err) {
    console.error(`[SMTP Email] Failed to send email to ${to}:`, err.message);
    return false;
  }
};

module.exports = {
  sendEmail
};
