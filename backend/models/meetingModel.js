import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String },
    project: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // links to whoever created the meeting (executive or secretary)
    },
  },
  { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);
