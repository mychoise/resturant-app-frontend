import { toast } from "sonner";
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
    throw error; // ← Add this
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
    toast.error("Error fetching table data. Please try again.");
    throw error;
  }
};

export const getAllOrderedItems = async (table_id: string) => {
  try {
    const result = await axiosInstance.get(`/order/all/${table_id}`);
    return result;
  } catch (error) {
    console.error("Error fetching all ordered items:", error);
    toast.error("Error fetching all ordered items. Please try again.");
    throw error;
  }
};

export const createPayment = async (
  order_id: string,
  table_id: string,
  payment_type: "cash" | "online",
) => {
  try {
    const result = await axiosInstance.post("/payment/pay", {
      order_id,
      table_id,
      payment_type,
    });
    return result.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    toast.error("Error creating payment. Please try again.");
    throw error;
  }
};

export const getAllMenuItems = async () => {
  try {
    const result = await axiosInstance.get("/menu/all");
    return result.data;
  } catch (error) {
    console.log(
      "error in get menu items",
      error.response?.data || error.message,
    );
    toast.error("Error fetching menu items. Please try again.");
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const result = await axiosInstance.get("/auth/stats");
    return result.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    toast.error("Error fetching user stats. Please try again.");
    throw error;
  }
};

export const getOrderStats = async () => {
  try {
    const result = await axiosInstance.get("/order/stats");
    return result.data;
  } catch (error) {
    console.error("Error fetching order stats:", error);
    toast.error("Error fetching order stats. Please try again.");
    throw error;
  }
};

export const getPaymentStats = async () => {
  try {
    const result = await axiosInstance.get("/payment/stats");
    return result.data;
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    toast.error("Error fetching payment stats. Please try again.");
    throw error;
  }
};

export const getAllUsersAdmin = async (page: number, category?: string) => {
  try {
    const result = await axiosInstance.get(
      `/auth/users?page=${page}${category ? `&category=${category}` : ""}`,
    );
    return result.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    toast.error("Error fetching all users. Please try again.");
    throw error;
  }
};

export const getAllOrders = async (
  page: number,
  status?: string,
  date?: string,
  table_id?: string,
) => {
  try {
    const result = await axiosInstance.get(
      `/order/order?page=${page}${status ? `&status=${status}` : ""}${
        date ? `&date=${date}` : ""
      }${table_id ? `&table_id=${table_id}` : ""}`,
    );
    return result.data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    toast.error("Error fetching all orders. Please try again.");
    throw error;
  }
};

export const getAllPayments = async (
  page: number,
  paymentType?: string,
  date?: string,
) => {
  try {
    const result = await axiosInstance.get(
      `/payment/all?page=${page}${
        paymentType ? `&paymentType=${paymentType}` : ""
      }${date ? `&date=${date}` : ""}`,
    );
    return result.data;
  } catch (error) {
    console.error("Error fetching all payments:", error);
    toast.error("Error fetching all payments. Please try again.");
    throw error;
  }
};
