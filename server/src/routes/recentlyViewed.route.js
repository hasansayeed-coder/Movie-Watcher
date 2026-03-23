import express from "express";
import { body } from "express-validator";
import recentlyViewedController from "../controllers/recentlyViewed.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router();

router.get(
  "/",
  tokenMiddleware.auth,
  recentlyViewedController.getAll
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
  recentlyViewedController.add
);

router.delete(
  "/clear",
  tokenMiddleware.auth,
  recentlyViewedController.clear
);

router.delete(
  "/:mediaId",
  tokenMiddleware.auth,
  recentlyViewedController.remove
);

export default router;