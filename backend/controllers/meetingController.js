import Meeting from "../models/meetingModel.js";

// GET all meetings
export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().populate("user", "name email role");
    res.json(meetings);
  } catch (error) {
    console.error("❌ Error fetching meetings:", error);
    res.status(500).json({ message: "Failed to load meetings" });
  }
};

// CREATE a meeting
export const createMeeting = async (req, res) => {
  try {
    const { title, date, time, venue, project } = req.body;

    const meeting = new Meeting({
      title,
      date,
      time,
      venue,
      project,
      status: "pending",
      user: req.user._id,     // 🔥 REQUIRED FIX
    });

    await meeting.save();
    res.status(201).json(meeting);

  } catch (error) {
    console.error("❌ Error creating meeting:", error);
    res.status(500).json({ message: "Failed to add meeting" });
  }
};

// RESOLVE a meeting
export const resolveMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Executives can resolve only their own meetings
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
    res.status(500).json({ message: "Failed to resolve meeting" });
  }
};
