import { Banknote, LogOutIcon, User, UtensilsCrossed } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const [selectedItem, setSelectedItem] = React.useState<number>(1);
  const navigate = useNavigate();
  const sidebarItems = [
    {
      id: 1,
      name: "User Management",
      link: "/admin",
      icon: <User />,
    },
    {
      id: 2,
      name: "Order Management",
      link: "/admin/order",
      icon: <UtensilsCrossed />,
    },
    {
      id: 3,
      name: "Payment Record",
      link: "/admin/payment",
      icon: <Banknote />,
    },
  ];

  useEffect(() => {
    const currentPath = window.location.pathname;
    const selectedItem = sidebarItems.find((item) => item.link === currentPath);
    if (selectedItem) {
      setSelectedItem(selectedItem.id);
    }
  }, []);

  return (
    <div className="flex bg-[#F6F3EF] flex-col gap-15 justify-between  pt-10 w-[14%] h-screen border-[#C8C7BF] border-r-2">
      <div className="flex pl-6 flex-col gap-15">
        <div className="">
          <h1 className="font-[font4] text-xl">The Banquet Palace</h1>
          <h1 className="font-[font2]">Resturant Admin</h1>
        </div>
        <div className="flex flex-col gap-4">
          {sidebarItems.map((item, index) => (
            <button
              onClick={() => {
                setSelectedItem(item.id);
                navigate(item.link);
              }}
              key={index}
              className="w-[90%] rounded-2xl"
            >
              <div
                className={`flex pl-3 -pr-5 transition-all rounded-l-2xl font-stretch-normal tracking-wider text-[8px] font-[font1] ${selectedItem === item.id && "border-r-4 border-[#735C00]  bg-[#F0EDE9]"} pt-3 pb-3 flex-row gap-2`}
              >
                {item.icon}
                <h1 className="text-[16px]">{item.name}</h1>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 mb-10 pt-4 border-t-2 border-[#C8C7BF] pl-7 ">
        <LogOutIcon color="#BA1A1A" />
        <h1 className="leading-7 text-[16px] font-[font1]">Sign Out</h1>
      </div>
    </div>
  );
};

export default AdminSidebar;
