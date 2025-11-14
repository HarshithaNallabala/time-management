import Meeting from "../models/meetingModel.js";

export const getMeetings = async (req, res) => {
  const meetings = await Meeting.find({ user: req.user._id });
  res.json(meetings);
};

export const createMeeting = async (req, res) => {
  const { title, time, venue, project } = req.body;
  const meeting = await Meeting.create({ user: req.user._id, title, time, venue, project });
  res.status(201).json(meeting);
};

