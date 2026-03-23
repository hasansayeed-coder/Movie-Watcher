import express from "express";
import userRoute from "./user.route.js";
import mediaRoute from "./media.route.js";
import personRoute from "./person.route.js";
import reviewRoute from "./review.route.js";
import recentlyViewedRoute from "./recentlyViewed.route.js";
import watchlistRoute from "./watchlist.route.js";
import avatarRoute from "./avatar.route.js";
import reviewVoteRoute from "./reviewVote.route.js";          // ← add

const router = express.Router();

router.use("/user", userRoute);
router.use("/person", personRoute);
router.use("/reviews", reviewRoute);
router.use("/reviews", reviewVoteRoute);                      // ← add (shares /reviews prefix)
router.use("/recently-viewed", recentlyViewedRoute);
router.use("/watchlist", watchlistRoute);
router.use("/user/avatar", avatarRoute);
router.use("/:mediaType", mediaRoute);                        // ← wildcard stays last

export default router;