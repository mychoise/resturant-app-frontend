import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // point to your deployed backend
  withCredentials: true, // if using cookies
});
