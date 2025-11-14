// backend/models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    task: { type: String, required: true },
    time: { type: String }, // optional display time
    status: { type: String, enum: ["pending", "completed"], default: "pending" }, // resolve support
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);

