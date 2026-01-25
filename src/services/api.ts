import axios, { AxiosError } from "axios";

const SIGNUP_URL = "/api/auth/register";
const LOGIN_URL = "/api/auth/login";
const PROFILE_URL = "/profile";
const ME_URL = "/api/me";
const GET_CREATORS = "/getusers";

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
  // If data is FormData, remove Content-Type header to let browser set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
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

export const updateProfile = async (data: any) => {
  try {
    const response = await api.put(PROFILE_URL, data);
    console.log(response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    throw error as AxiosError;
  }
};

export const getCurrentUser = async () => {
  const response = await api.get(ME_URL);
  return response.data;
};
export const getAllCreator = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await api.get(GET_CREATORS, {
      params: {
        page,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch creators", error);
    throw error;
  }
};

export default api;
