import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api/meetings";

const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ------------------------
// GET all meetings
// ------------------------
export const getMeetings = async () => {
  const res = await axios.get(API_BASE, auth());
  return res.data;
};

// ------------------------
// CREATE a meeting
// ------------------------
export const createMeeting = async (meetingData: any) => {
  const res = await axios.post(API_BASE, meetingData, auth());
  return res.data;
};

// ------------------------
// RESOLVE a meeting
// ------------------------
export const resolveMeeting = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/${id}/resolve`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to resolve meeting");
  }

  return response.json();
};
