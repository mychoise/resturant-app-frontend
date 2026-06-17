import { LucideChevronRight } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <div>
      <div className="header">
        <div className="flex items-center space-x-2 font-[font2] font-[16px] uppercase tracking-widest">
          <span className="font-bold text-[#735C00]">1. Select Table</span>
          <LucideChevronRight className="size-3.5 mr-2 ml-2" />
          <span className=" text-[#474741]">2. Build Order</span>
        </div>

        <div className="font-[font4] text-3xl mt-4">Floor Plan: Main Hall</div>
      </div>
    </div>
  );
};

export default Header;
