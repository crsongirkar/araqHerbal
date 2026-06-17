/**
 * Generates a visually stunning, responsive HTML email template for sending the OTP.
 *
 * @param {string} otpCode - The 6-digit OTP code.
 * @returns {string} The full HTML document as a string.
 */
function getOtpEmailTemplate(otpCode) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f6f8f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #2e3630;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 580px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid #e2ebd9;
      box-shadow: 0 4px 20px rgba(45, 106, 79, 0.04);
    }
    .header {
      background-color: #1a5c38;
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 26px;
      letter-spacing: 0.22em;
      color: #ffffff;
      font-weight: 300;
      font-family: Georgia, serif;
      margin: 0;
    }
    .tagline {
      font-size: 10px;
      letter-spacing: 0.15em;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      margin-top: 8px;
      font-weight: 600;
    }
    .content {
      padding: 48px 40px;
      text-align: center;
    }
    .title {
      font-size: 20px;
      color: #1e2521;
      margin: 0 0 16px 0;
      font-family: Georgia, serif;
      font-weight: 600;
    }
    .description {
      font-size: 14px;
      color: #5c6b62;
      line-height: 1.6;
      margin: 0 0 32px 0;
    }
    .otp-box {
      background-color: #f1f7f3;
      border: 1px dashed #2d6a4f;
      border-radius: 16px;
      padding: 20px 40px;
      display: inline-block;
      margin-bottom: 32px;
    }
    .otp-code {
      font-size: 38px;
      letter-spacing: 0.3em;
      font-weight: 800;
      color: #2d6a4f;
      font-family: Menlo, Monaco, Consolas, Courier, monospace;
      margin-left: 0.3em; /* to compensate letter-spacing right offset */
    }
    .expiry-note {
      font-size: 12px;
      color: #8c9c90;
      margin-bottom: 24px;
    }
    .footer {
      background-color: #fcfcfb;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #f0f3f1;
      font-size: 11px;
      color: #8c9c90;
      line-height: 1.5;
    }
    .footer a {
      color: #2d6a4f;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="logo">ARAQ</h1>
      <div class="tagline">Pure • Natural • Handcrafted</div>
    </div>
    
    <div class="content">
      <h2 class="title">Verification Code</h2>
      <p class="description">
        Please use the following 6-digit one-time passcode (OTP) to sign in to your ARAQ account. 
        This code is confidential and will verify your identity.
      </p>
      
      <div class="otp-box">
        <span class="otp-code">${otpCode}</span>
      </div>
      
      <div class="expiry-note">
        This passcode is valid for the next <strong>5 minutes</strong>. If you did not request this code, you can safely ignore this email.
      </div>
    </div>
    
    <div class="footer">
      © ${new Date().getFullYear()} ARAQ Herbal Inc. All rights reserved.<br>
      Pure botanical elixirs, cold-process bars, and remedies.<br>
      <a href="https://hello.araqherbal.com">Visit our website</a>
    </div>
  </div>
</body>
</html>
  `;
}

function getSubscriptionEmailTemplate() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the ARAQ Circle</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f6f8f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #2e3630;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 580px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid #e2ebd9;
      box-shadow: 0 4px 20px rgba(45, 106, 79, 0.04);
    }
    .header {
      background-color: #1a5c38;
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 26px;
      letter-spacing: 0.22em;
      color: #ffffff;
      font-weight: 300;
      font-family: Georgia, serif;
      margin: 0;
    }
    .tagline {
      font-size: 10px;
      letter-spacing: 0.15em;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      margin-top: 8px;
      font-weight: 600;
    }
    .content {
      padding: 48px 40px;
      text-align: center;
    }
    .title {
      font-size: 22px;
      color: #1e2521;
      margin: 0 0 16px 0;
      font-family: Georgia, serif;
      font-weight: 600;
    }
    .description {
      font-size: 14px;
      color: #5c6b62;
      line-height: 1.6;
      margin: 0 0 24px 0;
      text-align: left;
    }
    .welcome-badge {
      background-color: #f1f7f3;
      border: 1px solid #2d6a4f;
      border-radius: 12px;
      padding: 16px;
      font-size: 13px;
      color: #2d6a4f;
      font-weight: 500;
      display: block;
      margin-bottom: 24px;
      text-align: center;
    }
    .footer {
      background-color: #fcfcfb;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #f0f3f1;
      font-size: 11px;
      color: #8c9c90;
      line-height: 1.5;
    }
    .footer a {
      color: #2d6a4f;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="logo">ARAQ</h1>
      <div class="tagline">Pure • Natural • Handcrafted</div>
    </div>
    
    <div class="content">
      <h2 class="title">Welcome to the ARAQ Family</h2>
      <p class="description">
        Thank you for subscribing to the ARAQ Herbal newsletter! You are now part of our inner circle.
      </p>
      
      <p class="description">
        We're excited to share seasonal releases, botanical insights, skincare rituals, and exclusive member-only offers with you. Stay tuned for our next update!
      </p>
      
      <div class="welcome-badge">
        🌿 Your subscription has been confirmed successfully.
      </div>
    </div>
    
    <div class="footer">
      © ${new Date().getFullYear()} ARAQ Herbal Inc. All rights reserved.<br>
      Pure botanical elixirs, cold-process bars, and remedies.<br>
      <a href="https://hello.araqherbal.com">Visit our website</a>
    </div>
  </div>
</body>
</html>
  `;
}

function getWelcomeEmailTemplate(userName) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the ARAQ Family</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f6f8f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #2e3630;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 580px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid #e2ebd9;
      box-shadow: 0 4px 20px rgba(45, 106, 79, 0.04);
    }
    .header {
      background-color: #1a5c38;
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 26px;
      letter-spacing: 0.22em;
      color: #ffffff;
      font-weight: 300;
      font-family: Georgia, serif;
      margin: 0;
    }
    .tagline {
      font-size: 10px;
      letter-spacing: 0.15em;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      margin-top: 8px;
      font-weight: 600;
    }
    .content {
      padding: 48px 40px;
      text-align: center;
    }
    .title {
      font-size: 22px;
      color: #1e2521;
      margin: 0 0 16px 0;
      font-family: Georgia, serif;
      font-weight: 600;
    }
    .description {
      font-size: 14px;
      color: #5c6b62;
      line-height: 1.6;
      margin: 0 0 24px 0;
      text-align: left;
    }
    .cta-button {
      display: inline-block;
      background-color: #2d6a4f;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      margin: 16px 0 32px 0;
      letter-spacing: 0.05em;
    }
    .footer {
      background-color: #fcfcfb;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #f0f3f1;
      font-size: 11px;
      color: #8c9c90;
      line-height: 1.5;
    }
    .footer a {
      color: #2d6a4f;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="logo">ARAQ</h1>
      <div class="tagline">Pure • Natural • Handcrafted</div>
    </div>
    
    <div class="content">
      <h2 class="title">Welcome to the ARAQ Family</h2>
      <p class="description">
        Hello ${userName},
      </p>
      
      <p class="description">
        Thank you for creating an account with us. We are absolutely thrilled to welcome you to the ARAQ family! 
      </p>
      
      <p class="description">
        Our passion is crafting high-quality, pure herbal elixirs, natural body bars, and botanical remedies using traditional methods and sustainably sourced ingredients. With your new account, you can track your shipments, manage your addresses, and view your order history easily.
      </p>
      
      <a href="http://localhost:3000" class="cta-button">Explore our Shop</a>
    </div>
    
    <div class="footer">
      © ${new Date().getFullYear()} ARAQ Herbal Inc. All rights reserved.<br>
      Pure botanical elixirs, cold-process bars, and remedies.<br>
      <a href="http://localhost:3000">Visit our website</a>
    </div>
  </div>
</body>
</html>
  `;
}

module.exports = { getOtpEmailTemplate, getSubscriptionEmailTemplate, getWelcomeEmailTemplate };
