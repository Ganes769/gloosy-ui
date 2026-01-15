import axios, { AxiosError } from "axios";

const SIGNUP_URL = "/api/auth/register";
const LOGIN_URL = "/api/auth/login";
const PROFILE_URL = "/api/profile";

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

export const updateProfile = async (data: any, profilePictureFile?: File) => {
  try {
    const formData = new FormData();
    
    // Append all form fields
    Object.keys(data).forEach((key) => {
      // Convert Date objects to ISO strings for FormData
      if (data[key] instanceof Date) {
        formData.append(key, data[key].toISOString());
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, String(data[key]));
      }
    });
    
    // Append profile picture file if provided (backend expects 'file' field for multer)
    // If no file but profilePicture URL exists in data, it will be sent as a string
    if (profilePictureFile) {
      formData.append("file", profilePictureFile);
    }
    
    const response = await api.put(PROFILE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
};

export default api;
