import responseHandler from "../handlers/response.handler.js";
import reviewModel from "../models/review.model.js";
import paginate from "../utils/paginate.js";
import reviewVoteModel from "../models/reviewVote.model.js";

const create = async (req, res) => {
  try {

    const review = new reviewModel({
      user: req.user.id,
      ...req.body
    });

    await review.save();

    responseHandler.created(res, {
      ...review._doc,
      id: review.id,
      user: req.user
    });
  } catch {
    responseHandler.error(res);
  }
};

const remove = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await reviewModel.findOne({
      _id: reviewId,
      user: req.user.id
    });

    if (!review) return responseHandler.notfound(res);

    await reviewModel.deleteOne({ _id: reviewId, user: req.user.id });

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getReviewsOfUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await paginate(
      reviewModel,
      { user: req.user.id },
      "-createdAt",
      page,
      pageSize
    );

    // Attach vote counts + user's own vote to each review
    const enriched = await Promise.all(
      result.results.map(async (review) => {
        const [likes, dislikes, userVote] = await Promise.all([
          reviewVoteModel.countDocuments({ review: review.id, voteType: "like" }),
          reviewVoteModel.countDocuments({ review: review.id, voteType: "dislike" }),
          reviewVoteModel.findOne({ review: review.id, user: req.user.id })
        ]);
        return {
          ...review.toJSON(),
          likes,
          dislikes,
          voted: userVote ? userVote.voteType : null
        };
      })
    );

    responseHandler.ok(res, { ...result, results: enriched });
  } catch {
    responseHandler.error(res);
  }
};

export default { create, remove, getReviewsOfUser };