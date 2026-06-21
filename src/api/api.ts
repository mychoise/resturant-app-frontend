import { axiosInstance } from "../lib/axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const register = async (
  name: string,
  email: string,
  password: string,
  role: "waiter" | "kitchen",
) => {
  try {
    const response = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/profile");
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getTable = async () => {
  try {
    const result = axiosInstance.get("/table/all");
    return result;
  } catch (error) {
    console.log(
      "error in getting table",
      error.response?.data || error.message,
    );
  }
};
