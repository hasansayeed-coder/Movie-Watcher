import responseHandler from "../handlers/response.handler.js";
import recentlyViewedModel from "../models/recentlyViewed.model.js";

const MAX_ITEMS = 10;

const add = async (req, res) => {
  try {
    const { mediaType, mediaId, mediaTitle, mediaPoster, mediaRate } = req.body;

    // If already exists for this user, remove it first (will re-add at top)
    await recentlyViewedModel.deleteOne({
      user: req.user.id,
      mediaId
    });

    // Insert fresh at the "top" (latest createdAt)
    const entry = new recentlyViewedModel({
      user: req.user.id,
      mediaType,
      mediaId,
      mediaTitle,
      mediaPoster,
      mediaRate
    });

    await entry.save();

    // Trim to max 10 — delete oldest entries beyond the limit
    const all = await recentlyViewedModel
      .find({ user: req.user.id })
      .sort("-createdAt");

    if (all.length > MAX_ITEMS) {
      const toDelete = all.slice(MAX_ITEMS).map(e => e._id);
      await recentlyViewedModel.deleteMany({ _id: { $in: toDelete } });
    }

    responseHandler.created(res, entry);
  } catch {
    responseHandler.error(res);
  }
};

const getAll = async (req, res) => {
  try {
    const entries = await recentlyViewedModel
      .find({ user: req.user.id })
      .sort("-createdAt");

    responseHandler.ok(res, entries);
  } catch {
    responseHandler.error(res);
  }
};

const remove = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const entry = await recentlyViewedModel.findOne({
      user: req.user.id,
      mediaId
    });

    if (!entry) return responseHandler.notfound(res);

    await recentlyViewedModel.deleteOne({ _id: entry._id });

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const clear = async (req, res) => {
  try {
    await recentlyViewedModel.deleteMany({ user: req.user.id });
    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

export default { add, getAll, remove, clear };