// backend/routes/leaveRoutes.js
import express from "express";
import Leave from "../models/Leave.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Leave (date range)
router.post("/", protect, async (req, res) => {
  const { startDate, endDate, reason } = req.body;
  if (!startDate || !endDate) {
    return res.status(400).json({ message: "startDate and endDate are required" });
  }
  const leave = await Leave.create({
    user: req.user._id,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    reason: reason || "",
  });
  res.status(201).json(leave);
});

// Get Leaves (optionally by range)
router.get("/", protect, async (req, res) => {
  const { from, to } = req.query;
  const filter = { user: req.user._id };
  if (from && to) {
    filter.startDate = { $lte: new Date(to) };
    filter.endDate = { $gte: new Date(from) };
  }
  const leaves = await Leave.find(filter).sort({ startDate: 1 });
  res.json(leaves);
});

// Delete a leave entry
router.delete("/:id", protect, async (req, res) => {
  const del = await Leave.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!del) return res.status(404).json({ message: "Leave not found" });
  res.json({ message: "Leave deleted" });
});

export default router;

