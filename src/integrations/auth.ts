import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const registerUser = async (name: string, email: string, password: string, role: string) => {
  const res = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

