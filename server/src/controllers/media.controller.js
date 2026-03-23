import responseHandler from "../handlers/response.handler.js";
import tmdbApi from "../tmdb/tmdb.api.js";
import userModel from "../models/user.model.js";
import favoriteModel from "../models/favorite.model.js";
import reviewModel from "../models/review.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import watchlistModel from "../models/watchlist.model.js";
import reviewVoteModel from "../models/reviewVote.model.js";


const getList = async (req, res) => {
  try {
    const { page } = req.query;
    const { mediaType, mediaCategory } = req.params;

    console.log('🔍 Fetching:', { mediaType, mediaCategory, page });

    const response = await tmdbApi.mediaList({ mediaType, mediaCategory, page });

    console.log('✅ Got response, sending to client');

    return responseHandler.ok(res, response);
  } catch (error) {
    console.error('❌ Error in getList:', error.message);
    responseHandler.error(res);
  }
};

const getGenres = async (req, res) => {
  try {
    const { mediaType } = req.params;

    console.log('🔍 Fetching genres for:', mediaType);

    const response = await tmdbApi.mediaGenres({ mediaType });

    console.log('✅ Got genres, sending to client');

    return responseHandler.ok(res, response);
  } catch (error) {
    console.error('❌ Error in getGenres:', error.message);
    responseHandler.error(res);
  }
};

const search = async (req, res) => {
  try {
    const { mediaType } = req.params;
    const { query, page } = req.query;

    const response = await tmdbApi.mediaSearch({
      query,
      page,
      mediaType: mediaType === "people" ? "person" : mediaType
    });

    return responseHandler.ok(res, response);
  } catch (error) {
    console.error('❌ Error in search:', error.message);
    responseHandler.error(res);
  }
};

const getDetail = async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;
    const params = { mediaType, mediaId };
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    const media = await tmdbApi.mediaDetail(params);

    const [credits, videos, recommend, images] = await Promise.all([
      tmdbApi.mediaCredits(params),
      tmdbApi.mediaVideos(params),
      tmdbApi.mediaRecommend(params),
      tmdbApi.mediaImages(params)
    ]);

    media.credits = credits;
    media.videos = videos;
    media.recommend = recommend.results;
    media.images = images;

    // Decode token once — used for both isFavorite/isInWatchlist and voted
    const tokenDecoded = tokenMiddleware.tokenDecode(req);
    const currentUser = tokenDecoded
      ? await userModel.findById(tokenDecoded.data)
      : null;

    if (currentUser) {
      const [isFavorite, isInWatchlist] = await Promise.all([
        favoriteModel.findOne({ user: currentUser.id, mediaId }),
        watchlistModel.findOne({ user: currentUser.id, mediaId })
      ]);
      media.isFavorite = isFavorite !== null;
      media.isInWatchlist = isInWatchlist !== null;
    }

    // Paginated reviews with vote counts
    const skip = (page - 1) * pageSize;
    const [reviewDocs, totalReviews] = await Promise.all([
      reviewModel.find({ mediaId }).populate("user").sort("-createdAt").skip(skip).limit(pageSize),
      reviewModel.countDocuments({ mediaId })
    ]);

    const reviewsWithVotes = await Promise.all(
      reviewDocs.map(async (review) => {
        const [likes, dislikes, userVote] = await Promise.all([
          reviewVoteModel.countDocuments({ review: review.id, voteType: "like" }),
          reviewVoteModel.countDocuments({ review: review.id, voteType: "dislike" }),
          currentUser
            ? reviewVoteModel.findOne({ review: review.id, user: currentUser.id })
            : Promise.resolve(null)
        ]);
        return {
          ...review.toJSON(),
          likes,
          dislikes,
          voted: userVote ? userVote.voteType : null
        };
      })
    );

    media.reviews = {
      results: reviewsWithVotes,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / pageSize),
      totalResults: totalReviews,
      hasNextPage: page < Math.ceil(totalReviews / pageSize),
      hasPrevPage: page > 1
    };

    responseHandler.ok(res, media);
  } catch (e) {
    console.log(e);
    responseHandler.error(res);
  }
};

export default { getList, getGenres, search, getDetail };