import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Meeting from "../models/meetingModel.js";

const router = express.Router();

// ✅ PATCH /api/meetings/:id/resolve
router.patch("/:id/resolve", protect, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // ✅ Secretaries can resolve any meeting
    // ✅ Executives can resolve only their own
    if (
      req.user.role === "executive" &&
      meeting.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to resolve this meeting" });
    }

    meeting.status = "completed";
    await meeting.save();

    res.json({ message: "Meeting resolved successfully", meeting });
  } catch (error) {
    console.error("❌ Error resolving meeting:", error);
    res.status(500).json({ message: "Server error while resolving meeting" });
  }
});

export default router;
