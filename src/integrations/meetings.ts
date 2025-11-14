import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to add auth token in header
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// ✅ Fetch all meetings
export const getMeetings = async () => {
  const res = await axios.get(`${API_URL}/meetings`, getAuthHeader());
  return res.data;
};

// ✅ Add a new meeting
export const createMeeting = async (meeting: any) => {
  const res = await axios.post(`${API_URL}/meetings`, meeting, getAuthHeader());
  return res.data;
};

// (Optional) ✅ Delete a meeting
export const deleteMeeting = async (meetingId: string) => {
  const res = await axios.delete(`${API_URL}/meetings/${meetingId}`, getAuthHeader());
  return res.data;
};

