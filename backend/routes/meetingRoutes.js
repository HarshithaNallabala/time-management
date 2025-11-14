import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createMeeting,
  getMeetings,
  resolveMeeting,
} from "../controllers/meetingController.js";

const router = express.Router();

// GET all meetings
router.get("/", protect, getMeetings);

// CREATE a meeting
router.post("/", protect, createMeeting);

// RESOLVE a meeting
router.patch("/:id/resolve", protect, resolveMeeting);

export default router;
