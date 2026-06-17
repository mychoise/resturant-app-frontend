import React, { useState } from "react";
import { sepratedColor, table } from "../../constants/constants";

const LeftPart = ({ selectedTable, setSelectedTable }) => {
  console.log(selectedTable);
  return (
    <div>
      <div className="left-part w-262.5 ">
        {/* //top part */}
        <div className="bg-[#F6F3EF] pl-4 h-14 flex justify-between gap-6 border border-[#C8C7BF] rounded-xl">
          <div className="flex gap-6">
            {sepratedColor.map((item, index) => (
              <div key={index} className="flex items-center h-full gap-3">
                <div
                  className={`w-4 h-4 ${item.color} border border-[#777770]  rounded-[3px] `}
                ></div>
                <h1 className="font-[font2] font-medium text-[15px]">
                  {item.text}
                </h1>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[17px] font-[font1] text-[#474741] italic mr-7">
            <h1>Showing Main Dining Zone</h1>
          </div>
        </div>

        {/* downpart */}

        <div className="bg-[#F6F3EF]  relative mt-6  rounded-xl border border-[#C8C7BF] h-120">
          {/* //entrance part */}
          <div className=" flex items-center justify-center ">
            <div className="bg-[#F0EDE9] pb-1.5 font-semibold pt-1 font-[font2] uppercase text-[13px] tracking-widest text-[#474741] rounded-b-2xl text-center w-35 border border-[#C8C7BF]">
              Entrance
            </div>
          </div>

          <div className="pl-20 pt-10 flex flex-wrap gap-25">
            {table.map((item, index) => (
              <div key={index}>
                <button
                  disabled={item.status === "occupied"}
                  onClick={() => setSelectedTable(item.tableNo)}
                  className={`w-21  ${item.status === "occupied" ? "bg-[#EBE9E5]  cursor-not-allowed" : selectedTable === item.tableNo ? "bg-[#FFE088] cursor-pointer" : "bg-[#FFFFFF] cursor-pointer"}  ${item.value === "vip" ? "w-40" : "w-21"} ${item.value === "vip" ? "font-[font4] text-2xl" : "font-[font2]"} h-21 rounded-xl  border-2 border-[#C8C7BF]  flex items-center justify-center   font-bold`}
                >
                  {item.value === "vip"
                    ? item.text + "-" + "VIP"
                    : item.tableNo}
                </button>{" "}
                <h1 className="text-center mt-0.5 text-[#424241] font-[font1] text-[13.5px]">
                  {item.guest}
                </h1>
              </div>
            ))}

            {/* <div><div className='w-40 h-21 rounded-xl border-2 border-[#C8C7BF]  flex items-center justify-center bg-[#EBE9E5] font-[font4] text-[25px] font-bold'>05-Vip</div> <h1 className='text-center text-[#424241] font-[font1] text-[13.5px]'>4 guests</h1></div>
                                <div><div className='w-21 h-21 rounded-xl border-2 border-[#C8C7BF]  flex items-center justify-center bg-[#EBE9E5]  font-bold'>02</div> <h1 className='text-center text-[#424241] font-[font1] text-[13.5px]'>4 guests</h1></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPart;
