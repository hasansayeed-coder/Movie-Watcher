import rateLimit from "express-rate-limit";

const message = (action) => ({
  status: 429,
  message: `Too many ${action} attempts. Please try again later.`
});

export const signinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 1000,
  standardHeaders: true,       // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  message: message("signin")
});

export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hour
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: message("signup")
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: message("request")
});