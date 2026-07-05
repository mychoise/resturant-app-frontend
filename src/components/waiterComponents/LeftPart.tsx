import React, { useEffect, useState } from "react";
import { sepratedColor, table } from "../../constants/constants";
import { useTable } from "../../hooks/auth.hook";
import { socket } from "../../lib/socket";
import { useQueryClient } from "@tanstack/react-query";

const LeftPart = ({ selectedTable, setSelectedTable }) => {
  const { data } = useTable();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleNewOrder = (order) => {
      console.log("New order received:", order);
      console.log("order received for table:", order.table.table_number);
      queryClient.setQueryData(["table"], (oldData) => {
        console.log("oldData", oldData);
        const updated = oldData?.map((table) =>
          table.table_number === order.table.table_number
            ? { ...table, is_occupied: true }
            : table,
        );
        console.log("updated", updated);
        return updated;
      });
    };

    socket.on("order:new", handleNewOrder);

    return () => {
      socket.off("order:new", handleNewOrder);
    };
  }, [queryClient]);
  console.log(selectedTable);
  return (
    <div>
      <div className="left-part sm:mr-0 mr-3 w-full sm:w-262.5 ">
        {/* //top part */}
        <div className="bg-[#F6F3EF] pl-4 sm:mr-0 mr-3 sm:h-14 sm:pt-0 sm:pb-0 pt-2 pb-2 h-auto  flex justify-between gap-6 border border-[#C8C7BF] rounded-xl">
          <div className="flex flex-col  sm:flex-row gap-6">
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

          <div className=" items-center gap-3 hidden sm:flex   text-[17px] font-[font1] text-[#474741] italic mr-7">
            <h1>Showing Main Dining Zone</h1>
          </div>
        </div>

        {/* downpart */}

        <div className="bg-[#F6F3EF] sm:mr-0 mr-3 flex flex-col relative mt-6 pb-9 rounded-xl border border-[#C8C7BF] h-auto sm:h-120">
          {/* //entrance part */}
          <div className=" flex items-center justify-center ">
            <div className="bg-[#F0EDE9] pb-1.5 font-semibold pt-1 font-[font2] uppercase text-[13px] tracking-widest text-[#474741] rounded-b-2xl text-center w-35 border border-[#C8C7BF]">
              Entrance
            </div>
          </div>

          <div className="sm:pl-20  pl-10 sm:pr-0 pr-5 pt-10 flex justify-center sm:justify-start flex-wrap gap-10 sm:gap-25">
            {data?.map((item, index) => (
              <div key={index}>
                <button
                  // disabled={item.is_occupied === true}
                  onClick={() => setSelectedTable(item)}
                  className={`w-21  ${item.is_occupied === true ? "bg-[#EBE9E5]  cursor-not-allowed" : selectedTable?.table_number === item.table_number ? "bg-[#FFE088] cursor-pointer" : "bg-[#FFFFFF] cursor-pointer"}  ${item.value === "vip" ? "w-40" : "sm:w-21 w-10"} ${item.value === "vip" ? "font-[font4] text-2xl" : "font-[font2]"} sm:h-21 h-20 rounded-xl  border-2 border-[#C8C7BF]  flex items-center justify-center   font-bold`}
                >
                  {String(item.table_number).padStart(2, "0")}
                  {/*{item.value === "vip"
                    ? item.text + "-" + "VIP"
                    : String(item.table_number).padStart(2, "0")}*/}
                </button>{" "}
                <h1 className="text-center mt-0.5 text-[#424241] font-[font1] text-[13.5px]">
                  2 guests
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
