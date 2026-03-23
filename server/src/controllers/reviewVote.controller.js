import responseHandler from "../handlers/response.handler.js";
import reviewVoteModel from "../models/reviewVote.model.js";
import reviewModel from "../models/review.model.js";

const vote = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { voteType } = req.body;

    // Make sure review exists
    const review = await reviewModel.findById(reviewId);
    if (!review) return responseHandler.notfound(res);

    // Check if user already voted on this review
    const existingVote = await reviewVoteModel.findOne({
      user: req.user.id,
      review: reviewId
    });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Same vote type → toggle off (remove vote, YouTube style)
        await reviewVoteModel.deleteOne({ _id: existingVote._id });

        const counts = await getVoteCounts(reviewId);
        return responseHandler.ok(res, { voted: null, ...counts });
      } else {
        // Different vote type → switch vote (like → dislike or vice versa)
        existingVote.voteType = voteType;
        await existingVote.save();

        const counts = await getVoteCounts(reviewId);
        return responseHandler.ok(res, { voted: voteType, ...counts });
      }
    }

    // No existing vote → create new
    await reviewVoteModel.create({
      user: req.user.id,
      review: reviewId,
      voteType
    });

    const counts = await getVoteCounts(reviewId);
    responseHandler.created(res, { voted: voteType, ...counts });
  } catch {
    responseHandler.error(res);
  }
};

const getVotes = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await reviewModel.findById(reviewId);
    if (!review) return responseHandler.notfound(res);

    const counts = await getVoteCounts(reviewId);

    // If user is authenticated, include their vote
    let voted = null;
    if (req.user) {
      const existingVote = await reviewVoteModel.findOne({
        user: req.user.id,
        review: reviewId
      });
      voted = existingVote ? existingVote.voteType : null;
    }

    responseHandler.ok(res, { voted, ...counts });
  } catch {
    responseHandler.error(res);
  }
};

// Reusable helper — get like/dislike counts for a review
const getVoteCounts = async (reviewId) => {
  const [likes, dislikes] = await Promise.all([
    reviewVoteModel.countDocuments({ review: reviewId, voteType: "like" }),
    reviewVoteModel.countDocuments({ review: reviewId, voteType: "dislike" })
  ]);
  return { likes, dislikes };
};

export default { vote, getVotes };