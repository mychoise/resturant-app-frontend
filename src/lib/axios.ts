import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://192.168.1.71:3000/", // point to your deployed backend
  withCredentials: true, // if using cookies
});
