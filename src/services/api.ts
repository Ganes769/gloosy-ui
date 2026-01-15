import axios, { AxiosError } from "axios";

const SIGNUP_URL = "/api/auth/register";
const LOGIN_URL = "/api/auth/login";
const PROFILE_URL = "/profile";

const api = axios.create({
  baseURL: "https://gloosy-backend.vercel.app",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signUp = async (data: any) => {
  try {
    const response = await api.post(SIGNUP_URL, data);
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
};

export const login = async (data: any) => {
  try {
    const response = await api.post(LOGIN_URL, data);
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
};

export default api;
