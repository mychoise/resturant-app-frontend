import React from "react";
import AdminSidebar from "../admin/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex flex-row">
      <AdminSidebar />
      <main className="bg-[#FCF9F5] w-[84%] h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
