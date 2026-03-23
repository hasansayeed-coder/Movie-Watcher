import cloudinary from "../config/cloudinary.config.js";
import userModel from "../models/user.model.js";
import responseHandler from "../handlers/response.handler.js";

const uploadAvatar = async (req, res) => {
  try {
    // multer already uploaded to Cloudinary at this point
    if (!req.file) return responseHandler.badrequest(res, "No image file provided");

    // Fetch user with avatarPublicId (select: false by default)
    const user = await userModel
      .findById(req.user.id)
      .select("avatarUrl avatarPublicId");

    if (!user) return responseHandler.notfound(res);

    // Delete old avatar from Cloudinary if one exists
    if (user.avatarPublicId) {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    }

    // Save new avatar info
    user.avatarUrl = req.file.path;           // Cloudinary secure URL
    user.avatarPublicId = req.file.filename;  // Cloudinary public_id

    await user.save();

    responseHandler.ok(res, {
      avatarUrl: user.avatarUrl
    });
  } catch {
    responseHandler.error(res);
  }
};

const removeAvatar = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("avatarUrl avatarPublicId");

    if (!user) return responseHandler.notfound(res);

    if (!user.avatarPublicId) {
      return responseHandler.badrequest(res, "No avatar to remove");
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(user.avatarPublicId);

    // Clear from DB
    user.avatarUrl = null;
    user.avatarPublicId = null;

    await user.save();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

export default { uploadAvatar, removeAvatar };