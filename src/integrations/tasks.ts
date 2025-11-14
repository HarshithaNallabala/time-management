import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to add auth token in header
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// ✅ Fetch all tasks for the logged-in user
export const getTasks = async () => {
  const res = await axios.get(`${API_URL}/tasks`, getAuthHeader());
  return res.data;
};

// ✅ Add a new task
export const createTask = async (task: string, time: string) => {
  const res = await axios.post(
    `${API_URL}/tasks`,
    { task, time },
    getAuthHeader()
  );
  return res.data;
};

// (Optional) ✅ Delete a task
export const deleteTask = async (taskId: string) => {
  const res = await axios.delete(`${API_URL}/tasks/${taskId}`, getAuthHeader());
  return res.data;
};

