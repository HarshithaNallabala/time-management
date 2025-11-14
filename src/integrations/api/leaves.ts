import axios from "axios";
const API = "http://127.0.0.1:5000/api";

const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const createLeave = async (startDate: string, endDate: string, reason?: string) => {
  const res = await axios.post(`${API}/leaves`, { startDate, endDate, reason }, auth());
  return res.data;
};

export const getLeaves = async (from?: string, to?: string) => {
  const res = await axios.get(`${API}/leaves`, {
    ...auth(),
    params: from && to ? { from, to } : {},
  });
  return res.data;
};

export const deleteLeave = async (id: string) => {
  const res = await axios.delete(`${API}/leaves/${id}`, auth());
  return res.data;
};

