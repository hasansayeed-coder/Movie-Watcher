import mongoose from "mongoose";
import modelOptions from "./model.options.js";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  salt: {
    type: String,
    required: true,
    select: false
  },
  avatarUrl: {
    type: String,
    default: null         // null = no avatar uploaded yet
  },
  avatarPublicId: {
    type: String,
    default: null,        // Cloudinary public_id — needed to delete old avatar
    select: false         // never expose this to the client
  } , 
  isVerified: {
    type: Boolean,
    default: false          // false until email verified
  },
  verificationToken: {
    type: String,
    default: null,
    select: false           // never expose to client
  },
  verificationTokenExpiry: {
    type: Date,
    default: null,
    select: false
  } , 
  resetPasswordToken: {
  type: String,
  default: null,
  select: false
},
resetPasswordTokenExpiry: {
  type: Date,
  default: null,
  select: false
}
}, modelOptions);

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.password = crypto.pbkdf2Sync(
    password, this.salt, 600000, 64, "sha512"
  ).toString("hex");
};


userSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(
    password, this.salt, 600000, 64, "sha512"
  ).toString("hex");
  return this.password === hash;
};


userSchema.methods.generateVerificationToken = function() {
  const token = crypto.randomBytes(32).toString("hex");
  this.verificationToken = token;
  this.verificationTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return token;
};

userSchema.methods.generateResetPasswordToken = function() {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = token;
  this.resetPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return token;
};

const userModel = mongoose.model("User", userSchema);

export default userModel;