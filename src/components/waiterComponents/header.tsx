import { LucideChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Header = ({ page }: { page: string }) => {
  return (
    <div>
      <div className="header">
        <div className="flex items-center space-x-2 font-[font2] font-[16px] uppercase tracking-widest">
          <Link to="/">
            <span
              className={
                page === "select-table"
                  ? "font-bold text-[#735C00]"
                  : "text-[#474741]"
              }
            >
              1. Select Table
            </span>
          </Link>

          <LucideChevronRight className="size-3.5 mr-2 ml-2" />
          <span
            className={
              page === "select-menu"
                ? "font-bold text-[#735C00]"
                : "text-[#474741]"
            }
          >
            2. Build Order
          </span>
        </div>

        <div className="font-[font4] text-3xl mt-4">Floor Plan: Main Hall</div>
      </div>
    </div>
  );
};

export default Header;
