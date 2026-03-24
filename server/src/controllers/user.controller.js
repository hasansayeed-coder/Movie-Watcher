import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import tokenBlacklist from "../utils/tokenBlacklist.js";
import sendEmail from "../utils/sendEmail.js";

// Add to top of file or in a shared config:
if (!process.env.TOKEN_SECRET) throw new Error("TOKEN_SECRET is not set");

const signup = async (req, res) => {
  try {
    const { username, password, displayName } = req.body;

    const user = new userModel();
    user.displayName = displayName;
    user.username = username;
    user.setPassword(password);

    const token = user.generateVerificationToken();
    await user.save();

    // ✅ Respond immediately — don't wait for email
    responseHandler.created(res, {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      isVerified: user.isVerified
    });

    // ✅ Send email in background after response is sent
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    sendEmail.sendVerificationEmail({
      to: username,
      username: displayName,
      verificationUrl
    }).catch(err => console.error("Email send failed:", err));

  } catch {
    responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel
      .findOne({ username })
      .select("username password salt id displayName isVerified");

    if (!user) return responseHandler.badrequest(res, "User not exist");
    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    user.password = undefined;
    user.salt = undefined;

    // Allow login but include isVerified so frontend can show warning
    responseHandler.ok(res, {
      token,
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      isVerified: user.isVerified    // ← false = show warning on frontend
    });
  } catch {
    responseHandler.error(res);
  }
};

const signout = async (req, res) => {
  try {
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader.split(" ")[1];

    tokenBlacklist.add(token);

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await userModel.findById(req.user.id).select("password id salt");

    if (!user) return responseHandler.unauthorize(res);

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

    user.setPassword(newPassword);

    await user.save();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch {
    responseHandler.error(res);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) return responseHandler.badrequest(res, "Verification token is required");

    // Find user with this token and select hidden fields
    const user = await userModel
      .findOne({ verificationToken: token })
      .select("isVerified verificationToken verificationTokenExpiry");

    if (!user) return responseHandler.badrequest(res, "Invalid verification token");

    if (user.isVerified) return responseHandler.badrequest(res, "Email already verified");

    if (user.verificationTokenExpiry < new Date()) {
      return responseHandler.badrequest(res, "Verification token has expired");
    }

    // Mark as verified and clear token fields
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    responseHandler.ok(res, { message: "Email verified successfully" });
  } catch {
    responseHandler.error(res);
  }
};


const resendVerification = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("isVerified verificationToken verificationTokenExpiry displayName username");

    if (!user) return responseHandler.notfound(res);
    if (user.isVerified) return responseHandler.badrequest(res, "Email already verified");

    // Prevent spam — only resend if previous token expired or doesn't exist
    if (
      user.verificationTokenExpiry &&
      user.verificationTokenExpiry > new Date()
    ) {
      return responseHandler.badrequest(
        res,
        "A verification email was already sent. Please wait before requesting another."
      );
    }

    const token = user.generateVerificationToken();
    await user.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    await sendEmail.sendVerificationEmail({
      to: user.username,
      username: user.displayName,
      verificationUrl
    });

    responseHandler.ok(res, { message: "Verification email resent successfully" });

    // Send in background
sendEmail.sendVerificationEmail({
  to: user.username,
  username: user.displayName,
  verificationUrl
}).catch(err => console.error("Email send failed:", err));
  } catch {
    responseHandler.error(res);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await userModel
      .findOne({ username })
      .select("username displayName resetPasswordToken resetPasswordTokenExpiry");

    // Always return ok even if user not found — prevents email enumeration attacks
    if (!user) return responseHandler.ok(res, {
      message: "If that email exists, a reset link has been sent."
    });

    // Prevent spam — only send if previous token expired or doesn't exist
    if (
      user.resetPasswordTokenExpiry &&
      user.resetPasswordTokenExpiry > new Date()
    ) {
      return responseHandler.badrequest(
        res,
        "A reset email was already sent. Please wait before requesting another."
      );
    }

    const token = user.generateResetPasswordToken();
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await sendEmail.sendPasswordResetEmail({
      to: user.username,
      username: user.displayName,
      resetUrl
    });

    responseHandler.ok(res, {
      message: "If that email exists, a reset link has been sent."
    });

    sendEmail.sendPasswordResetEmail({
  to: user.username,
  username: user.displayName,
  resetUrl
}).catch(err => console.error("Email send failed:", err));
  } catch {
    responseHandler.error(res);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) return responseHandler.badrequest(res, "Reset token is required");

    const user = await userModel
      .findOne({ resetPasswordToken: token })
      .select("password salt resetPasswordToken resetPasswordTokenExpiry");

    if (!user) return responseHandler.badrequest(res, "Invalid reset token");

    if (user.resetPasswordTokenExpiry < new Date()) {
      return responseHandler.badrequest(res, "Reset token has expired");
    }

    // Set new password and clear reset token fields
    user.setPassword(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;
    await user.save();

    responseHandler.ok(res, { message: "Password reset successfully" });
  } catch {
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  updatePassword , 
  signout , 
  verifyEmail , 
  resendVerification , 
  resetPassword , 
  forgotPassword ,
};