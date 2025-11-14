import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String },
  project: { type: String },
  status: { type: String, default: "pending" },
  attendees: { type: [String], default: [] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Meeting", meetingSchema);

