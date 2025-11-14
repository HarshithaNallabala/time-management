// backend/routes/taskRoutes.js
import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get tasks
router.get("/", protect, async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(tasks);
});

// Create task
router.post("/", protect, async (req, res) => {
  const { task, time } = req.body;
  if (!task) return res.status(400).json({ message: "task is required" });
  const newTask = await Task.create({ user: req.user._id, task, time });
  res.status(201).json(newTask);
});

// Resolve (mark complete)
router.put("/:id/resolve", protect, async (req, res) => {
  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { status: "completed" },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Task not found" });
  res.json(updated);
});

// Delete (usually after completion)
router.delete("/:id", protect, async (req, res) => {
  const deleted = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!deleted) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
});

export default router;

