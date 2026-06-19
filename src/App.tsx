import React from "react";
import { Routes, Route } from "react-router-dom";
import TablePage from "./pages/waiterPage/TablePage";
import MenuPage from "./pages/waiterPage/MenuPage";
import MenuAddedSucess from "./pages/waiterPage/MenuAddedSucess";

const App = () => {
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
