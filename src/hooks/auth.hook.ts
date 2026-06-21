import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, login, getTable } from "../api/api";
import { useWaiterStore } from "../store/waiter.store";

export const useLogin = () => {
  const { user, setUser } = useWaiterStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      login(data.email, data.password),
    onSuccess: (data) => {
      console.log("Login successful:", data);
      setUser(data.user);
      queryClient.setQueryData(["user"], data.user);
      console.log("User set in store:", user);
    },
    onError: (error) => {
      console.error("Login failed:", error);
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
