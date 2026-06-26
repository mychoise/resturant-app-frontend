import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import TablePage from "./pages/waiterPage/TablePage";
import MenuPage from "./pages/waiterPage/MenuPage";
import MenuAddedSucess from "./pages/waiterPage/MenuAddedSucess";
import { socket } from "./lib/socket";
import WorkflowBoard from "./pages/kitchenPage/kitchen";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useWaiterStore } from "./store/waiter.store";
import { useCheckAuth } from "./hooks/auth.hook";
import { Toaster } from "react-hot-toast";
import MenuAddInPrevious from "./pages/waiterPage/MenuAddInPrevious";

const App = () => {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });
    socket.on("connect_error", (err) => console.log("error:", err.message));
    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
      // this should fire right after if token was invalid
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const { user, setUser, table } = useWaiterStore();
  const { isLoading, data } = useCheckAuth();

  useEffect(() => {
    if (data) {
      console.log("Auth check successful, user data:", data);
      setUser(data);
    }
  }, [data]);

  console.log("Table data from store:", table);

  if (isLoading) {
    return (
      <div className="bg-[#FCF9F5] w-full min-h-screen flex items-center justify-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="bg-[#FCF9F5] w-full min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              user && user?.role === "waiter" ? (
                <TablePage />
              ) : user && user?.role === "kitchen" ? (
                <WorkflowBoard />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/menu"
            element={
              user && user?.role === "waiter" ? (
                <MenuPage />
              ) : user && user?.role === "kitchen" ? (
                <WorkflowBoard />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/menuaddprev"
            element={
              user && user?.role === "waiter" ? (
                <MenuAddInPrevious />
              ) : user && user?.role === "kitchen" ? (
                <WorkflowBoard />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/success"
            element={
              user && user?.role === "waiter" ? (
                <MenuAddedSucess />
              ) : user && user?.role === "kitchen" ? (
                <WorkflowBoard />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/kitchen"
            element={
              user && user?.role === "kitchen" ? (
                <WorkflowBoard />
              ) : user && user?.role === "waiter" ? (
                <TablePage />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/login"
            element={
              user && user?.role === "waiter" ? (
                <TablePage />
              ) : user && user?.role === "kitchen" ? (
                <WorkflowBoard />
              ) : (
                <Login />
              )
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </>
  );
};

export default App;
