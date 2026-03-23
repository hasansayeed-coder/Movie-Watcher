import express from "express";
import avatarController from "../controllers/avatar.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Custom multer error handler
const handleUpload = (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: err.message  // "Only jpg, png and webp images are allowed" or "File too large"
      });
    }
    next();
  });
};

router.post(
  "/",
  tokenMiddleware.auth,
  handleUpload,
  avatarController.uploadAvatar
);

router.delete(
  "/",
  tokenMiddleware.auth,
  avatarController.removeAvatar
);

export default router;  