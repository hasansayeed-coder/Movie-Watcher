import responseHandler from "../handlers/response.handler.js";
import watchlistModel from "../models/watchlist.model.js";
import paginate from "../utils/paginate.js";

const add = async (req, res) => {
  try {
    const existing = await watchlistModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId
    });

    if (existing) return responseHandler.badrequest(res, "Already in watchlist");

    const entry = new watchlistModel({
      ...req.body,
      user: req.user.id
    });

    await entry.save();

    responseHandler.created(res, entry);
  } catch {
    responseHandler.error(res);
  }
};

const remove = async (req, res) => {
  try {
    const { watchlistId } = req.params;

    const entry = await watchlistModel.findOne({
      user: req.user.id,
      _id: watchlistId
    });

    if (!entry) return responseHandler.notfound(res);

    await watchlistModel.deleteOne({ _id: entry._id });

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const markWatched = async (req, res) => {
  try {
    const { watchlistId } = req.params;

    const entry = await watchlistModel.findOne({
      user: req.user.id,
      _id: watchlistId
    });

    if (!entry) return responseHandler.notfound(res);

    entry.watched = !entry.watched;   // toggle watched/unwatched
    await entry.save();

    responseHandler.ok(res, entry);
  } catch {
    responseHandler.error(res);
  }
};

const getWatchlist = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // Optional filter: ?watched=true or ?watched=false
    const query = { user: req.user.id };
    if (req.query.watched !== undefined) {
      query.watched = req.query.watched === "true";
    }

    const result = await paginate(
      watchlistModel,
      query,
      "-createdAt",
      page,
      pageSize
    );

    responseHandler.ok(res, result);
  } catch {
    responseHandler.error(res);
  }
};

export default { add, remove, markWatched, getWatchlist };