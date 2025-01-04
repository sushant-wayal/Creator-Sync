export const websiteName = "Creator Sync";
export const domain = "http://localhost:3000";
export const VERIFICATION_EMAIL = "verification";
export const FORGOT_PASSWORD_EMAIL = "forgotPassword";
export const PASSWORD_NOT_SET = "Password not set";
export const verificationEmailSubject = `Verify Your Email Address for ${websiteName}`;
export const verificationEmailContent = (name: string, token: string) => (
  `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(to bottom right, #000000, #ffffff);
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border: 1px solid #eeeeee;
        }
        .header {
          text-align: center;
          color: #333333;
        }
        .button {
          display: inline-block;
          padding: 8px 8px;
          margin: 20px 0;
          font-size: 16px;
          color: #ffffff;
          background-color: #222222;
          text-decoration: none;
          border-radius: 100px;
        }
        .footer {
          text-align: center;
          color: #888888;
          font-size: 12px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <h1 class="header">Welcome to ${websiteName}!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <a href="${domain}/verification?token=${token}" class="button">Verify Email</a>
        <p>If you didn’t sign up, you can safely ignore this email.</p>
        <div class="footer">
          <p>&copy; ${websiteName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
`
)
export const forgotPasswordEmailSubject = `Password Reset Request ${websiteName}`;
export const forgotPasswordEmailContent = (name: string, token: string) => (
  `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: linear-gradient(to bottom right, #000000, #ffffff);
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        color: #333333;
      }
      .button {
        display: inline-block;
        padding: 8px 8px;
        margin: 20px 0;
        font-size: 16px;
        color: #ffffff;
        background-color: #222222;
        text-decoration: none;
        border-radius: 100px;
      }
      .footer {
        text-align: center;
        color: #888888;
        font-size: 12px;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h1 class="header">Password Reset Request</h1>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. If you didn’t make the request, just ignore this email. Otherwise, you can reset your password using the button below:</p>
      <a href="${domain}/reset-password?token=${token}" class="button">Reset Password</a>
      <p>If you didn’t sign up, you can safely ignore this email.</p>
      <div class="footer">
        <p>&copy; ${websiteName}. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`
)
export const formatTime = (timeStamp: number) => {
  const hours = Math.floor(timeStamp / (100 * 60 * 60));
  const minutes = Math.floor((timeStamp % (100 * 60 * 60)) / (100 * 60));
  const seconds = Math.floor((timeStamp % (100 * 60)) / 100);
  let result = "";
  if (hours > 0) {
    result += `${hours < 10 ? '0' : ''}${hours}:`;
  }
  result += `${minutes < 10 ? '0' : ''}${isNaN(minutes) ? '00' : minutes}:${seconds < 10 ? '0' : ''}${isNaN(seconds) ? '00' : seconds}`;
  return result.trim();
}