import React from "react";
import StaffDirectory from "./ss";

const AdminViewEnployee = () => {
  const row = [
    {
      name: "Total Staff",
      value: 42,
    },
    {
      name: "Active Now",
      value: 18,
    },
    {
      name: "New Hires",
      value: "05",
    },
    {
      name: "Turnover rate",
      value: "26%",
    },
  ];
  return (
    <div className="bg-[#FCF9F5] pl-30 pr-30 pt-6">
      <h1 className="text-3xl font-[font4]">User Management</h1>
      <div className="flex flex-row justify-between">
        <p className="font-[font2] text-[#3D3D38] mt-3 w-3xl ">
          Oversee your culinary and service team. Manage roles, access levels,
          and track staff engagement across all restaurant locations.
        </p>
        <div className="gap-5  font-[font2] ">
          <button className="bg-[#FCF9F5]  border p-2 px-5 rounded-full">
            Export PDF
          </button>
          <button className="bg-[#735C00] ml-3 text-white p-2 px-5 rounded-full">
            Invite Members
          </button>
        </div>
      </div>

      <div className="flex gap-8 mt-10 ">
        {row.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 w-[24%] pb-3 pt-4 h-27 pl-10 pr-10 border border-[#C8C7BF] rounded-xl"
          >
            <h1 className="font-[font2] uppercase text-md">{item.name}</h1>
            <h1 className="font-[font4] mt-2 text-5xl">{item.value}</h1>
          </div>
        ))}
      </div>

      <div>
        <StaffDirectory />
      </div>
    </div>
  );
};

export default AdminViewEnployee;
