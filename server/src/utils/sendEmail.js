import transporter from "../config/mailtrap.config.js";

const sendVerificationEmail = async ({ to, username, verificationUrl }) => {
  await transporter.sendMail({
    from: `"Movie Watcher" <${process.env.MAIL_FROM}>`,
    to,
    subject: "Verify your Movie Watcher account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #1E3A5F;">Welcome to Movie Watcher, ${username}! 🎬</h2>
        <p>Thanks for signing up. Please verify your email address to activate your account.</p>
        <a href="${verificationUrl}"
          style="display: inline-block; padding: 12px 24px; background: #2E86C1;
                 color: white; border-radius: 6px; text-decoration: none;
                 font-weight: bold; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #888; font-size: 13px;">
          This link expires in 1 hour. If you did not create an account, ignore this email.
        </p>
        <p style="color: #888; font-size: 12px;">
          Or copy this link: ${verificationUrl}
        </p>
      </div>
    `
  });
};

const sendPasswordResetEmail = async ({ to, username, resetUrl }) => {
  await transporter.sendMail({
    from: `"Movie Watcher" <${process.env.MAIL_FROM}>`,
    to,
    subject: "Reset your Movie Watcher password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #1E3A5F;">Password Reset Request 🔑</h2>
        <p>Hi ${username}, we received a request to reset your password.</p>
        <a href="${resetUrl}"
          style="display: inline-block; padding: 12px 24px; background: #E74C3C;
                 color: white; border-radius: 6px; text-decoration: none;
                 font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #888; font-size: 13px;">
          This link expires in 1 hour. If you did not request a password reset, ignore this email.
          Your password will remain unchanged.
        </p>
        <p style="color: #888; font-size: 12px;">
          Or copy this link: ${resetUrl}
        </p>
      </div>
    `
  });
};

export default { sendVerificationEmail, sendPasswordResetEmail };