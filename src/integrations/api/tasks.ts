import axios from "axios";
const API = "http://127.0.0.1:5000/api";

const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getTasks = async () => {
  const res = await axios.get(`${API}/tasks`, auth());
  return res.data;
};

export const createTask = async (task: string, time?: string) => {
  const res = await axios.post(`${API}/tasks`, { task, time }, auth());
  return res.data;
};

export const resolveTask = async (id: string) => {
  const res = await axios.put(`${API}/tasks/${id}/resolve`, {}, auth());
  return res.data;
};

export const deleteTask = async (id: string) => {
  const res = await axios.delete(`${API}/tasks/${id}`, auth());
  return res.data;
};

