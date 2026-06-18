import React from "react";
import WaiterPage from "./pages/waiterPage/WaiterPage";
import { Routes, Route } from "react-router-dom";
import TablePage from "./components/waiterComponents/TablePage";

const App = () => {
  return (
    <div className="bg-[#FCF9F5] w-full min-h-screen">
      <Routes>
        <Route path="/" element={<TablePage />} />
        <Route path="/menu" element={<WaiterPage />} />
      </Routes>
    </div>
  );
};

export default App;
