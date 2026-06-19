import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import TablePage from "./pages/waiterPage/TablePage";
import MenuPage from "./pages/waiterPage/MenuPage";
import MenuAddedSucess from "./pages/waiterPage/MenuAddedSucess";
import { socket } from "./lib/socket";

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

  return (
    <div className="bg-[#FCF9F5] w-full min-h-screen">
      <Routes>
        <Route path="/" element={<TablePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/success" element={<MenuAddedSucess />} />
      </Routes>
    </div>
  );
};

export default App;
