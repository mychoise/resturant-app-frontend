import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://resturant-app-production-859a.up.railway.app/", // point to your deployed backend
  withCredentials: true, // if using cookies
});
