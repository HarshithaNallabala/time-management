// backend/models/Leave.js
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Leave", leaveSchema);

