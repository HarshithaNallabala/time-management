import axios from "axios";

const API = "http://127.0.0.1:5000/api";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api/meetings";

const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getMeetings = async () => {
  const res = await axios.get(`${API}/meetings`, auth());
  return res.data;
};

export const createMeeting = async (meetingData: any) => {
  const res = await axios.post(`${API}/meetings`, meetingData, auth());
  return res.data;
};

export const resolveMeeting = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5000/api/meetings/${id}/resolve`, {
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

