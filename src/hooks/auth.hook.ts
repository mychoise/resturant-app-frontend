import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUser,
  login,
  getTable,
  getAllOrderedItems,
  createPayment,
} from "../api/api";
import { useWaiterStore } from "../store/waiter.store";
import { toast } from "sonner";

export const useLogin = () => {
  const { user, setUser } = useWaiterStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      login(data.email, data.password),
    onSuccess: (data) => {
      console.log("🔴 onSuccess called with:", data); // ← Add this

      setUser(data?.user);
      queryClient.setQueryData(["user"], data?.user);
    },
    onError: (error) => {
      const errorMessage =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : error.response?.data?.message?.[0] // If it's an array
            ? error.response.data.message[0]
            : error.message || "Login failed. Please try again.";

      toast.error(errorMessage);
    },
  });
};

export const useCheckAuth = () => {
  const { setUser } = useWaiterStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth-check"],
    queryFn: async () => {
      console.log("queryFn executing");
      const res = await getUser();
      console.log("response:", res.data);
      return res.data;
    },
    retry: false,
  });

  return { isLoading, isError, data };
};

export const useTable = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["table"],
    queryFn: async () => {
      const res = await getTable();
      console.log("response for table is", res?.data);
      return res?.data;
    },
    retry: false,
  });

  return { isLoading, isError, data };
};

export const usePreviousOrders = (table_id: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["previous-orders", table_id],
    queryFn: async () => {
      const res = await getAllOrderedItems(table_id);
      console.log("response for previous orders is", res?.data);
      return res?.data;
    },
    retry: false,
  });

  return { isLoading, isError, data };
};

export const usePay = () => {
  return useMutation({
    mutationFn: (data: {
      order_id: string;
      table_id: string;
      payment_type: "cash" | "online";
    }) => createPayment(data.order_id, data.table_id, data.payment_type),
    onSuccess: (data) => {
      console.log("Payment successful:", data);
    },
    onError: (error) => {
      console.error("Payment failed:", error);
    },
  });
};
