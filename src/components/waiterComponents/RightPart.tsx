import { Minus } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const RightPart = ({ selectedTable }: { selectedTable: string | null }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="right-part sm:mr-0 mr-3 bg-[#F6F3EF] w-auto sm:w-120 rounded-xl max-h-80 p-10 border border-[#C8C7BF]">
        <div>
          <h1 className="font-[font4] text-[20px] ">Order Details</h1>
          <h1 className="font-[font2]  text-[16px] text-[#474741]">
            The Banquet Palace - Main Dining Room
          </h1>
          <div className="mt-5 flex items-center justify-between  bg-[#F6F3EF] pl-5 w-full pt-2 pb-2 rounded-xl border border-[#C8C7BF]">
            <div className="flex items-center justify-center gap-3">
              {" "}
              <h1 className="font-[font3] text-[25px] text-[#735C00]">chair</h1>
              <h1 className="font-[font2] text-[15px]">Selected Table</h1>
            </div>
            <h1 className="mr-5 font-[font2]  font-bold text-[16px]">
              {" "}
              {selectedTable ? (
                `Table ${String(selectedTable.table_number).padStart(2, "0")}`
              ) : (
                <Minus />
              )}
            </h1>
          </div>
          <hr className="border-[#C8C7BF] mt-5" />
          <button
            disabled={!selectedTable}
            onClick={() =>
              selectedTable?.is_occupied
                ? navigate("/menuaddprev")
                : navigate("/menu")
            }
            className={`text-[14px] w-full ${selectedTable ? "bg-black cursor-pointer" : "bg-[#C9C6C2] cursor-not-allowed"}   text-white font-bold mt-5 rounded-xl  pt-3 pb-3 uppercase font-[font2] tracking-wide text-center border border-[#C8C7BF]`}
          >
            Proceed to menu
          </button>
          <h1 className="text-[15px]  text-center text-[#474741] italic mb-5 mt-5">
            Select a table to continue
          </h1>
        </div>
      </div>
    </div>
  );
};

export default RightPart;
