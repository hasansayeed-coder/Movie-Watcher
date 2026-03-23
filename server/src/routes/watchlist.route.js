import express from "express";
import { body, query } from "express-validator";
import watchlistController from "../controllers/watchlist.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router();

router.get(
  "/",
  tokenMiddleware.auth,
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("pageSize").optional().isInt({ min: 1, max: 50 }).withMessage("pageSize must be between 1 and 50"),
  query("watched").optional().isBoolean().withMessage("watched must be true or false"),
  requestHandler.validate,
  watchlistController.getWatchlist
);

router.post(
  "/",
  tokenMiddleware.auth,
  body("mediaType")
    .exists().withMessage("mediaType is required")
    .custom(type => ["movie", "tv"].includes(type)).withMessage("mediaType invalid"),
  body("mediaId")
    .exists().withMessage("mediaId is required")
    .isLength({ min: 1 }).withMessage("mediaId can not be empty"),
  body("mediaTitle")
    .exists().withMessage("mediaTitle is required"),
  body("mediaPoster")
    .exists().withMessage("mediaPoster is required"),
  body("mediaRate")
    .exists().withMessage("mediaRate is required"),
  requestHandler.validate,
  watchlistController.add
);

router.patch(
  "/:watchlistId/watched",
  tokenMiddleware.auth,
  watchlistController.markWatched
);

router.delete(
  "/:watchlistId",
  tokenMiddleware.auth,
  watchlistController.remove
);

export default router;