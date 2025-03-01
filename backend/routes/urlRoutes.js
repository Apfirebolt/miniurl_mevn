import express from "express";
const router = express.Router();
import {
  createUrl,
  getUrl,
  getUserUrls,
  deleteUrl,
  incrementUrlCount,
} from "../controllers/urlController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").post(protect, createUrl).get(protect, getUserUrls);

router.route("/:id").get(protect, getUrl).delete(protect, deleteUrl);

router.route("/:id/count").patch(protect, incrementUrlCount);

export default router;
