import express from "express";
import { body } from "express-validator";
import reviewVoteController from "../controllers/reviewVote.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });

// GET votes for a review — auth optional (voted field only shown if logged in)
router.get(
  "/:reviewId/votes",
  tokenMiddleware.auth,
  reviewVoteController.getVotes
);

// POST a vote — auth required
router.post(
  "/:reviewId/votes",
  tokenMiddleware.auth,
  body("voteType")
    .exists().withMessage("voteType is required")
    .custom(type => ["like", "dislike"].includes(type))
    .withMessage("voteType must be like or dislike"),
  requestHandler.validate,
  reviewVoteController.vote
);

export default router;