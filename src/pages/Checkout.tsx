import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const Checkout = () => {
  const [show, setshow] = useState(false);
  return (
    <div className="bg-[#FDF9F0] overflow-x-hidden h-screen w-screen pt-10">
      <div className="text-[#735C00] pl-8 font-[font5] text-[48px]">
        THE BANQUET PALACE
      </div>

      <div className=" flex   mb-4 justify-center pt-10 items-center flex-col ">
        <div
          onClick={() => setshow(!show)}
          className="text-[#1C1C16] hover:text-[#735C00] transition-colors cursor-pointer flex items-center flex-col"
        >
          <h1 className="text-[45px] tracking-wide  font-[font5] ">
            View Particulars
          </h1>
          <ChevronDown
            className={` transition-all duration-500 ${show ? "rotate-180" : "rotate-0"}`}
          />
        </div>
      </div>
      <div
        className={`w-screen -pl-20 flex ${show ? "opacity-100" : "hidden opacity-0"} transition-all duration-1000 items-center justify-center`}
      >
        <div className=" border-t  border-[#735C00] pt-7 w-120">
          <div className="flex justify-between mb-3">
            <div className="flex font-serif gap-4 text-lg">
              <h1 className="text-[#797877]">I.</h1>
              <h1>Imperial Table Reservation</h1>
            </div>
            <h1 className="font-[font5] text-lg">200</h1>
          </div>
          {/*/* Add more items here as needed */}

          <div>
            <div className="border-t flex flex-col  border-[#D0C5AF] border-dotted">
              <div className="flex justify-between font-serif text-lg pt-2">
                <h1 className="text-[#5F5E5E]">Subtotal</h1>
                <h1 className="text-[#5F5E5E] font-[font2] text-[12px]">
                  2000
                </h1>
              </div>
              <div className="flex justify-between font-serif text-lg ">
                <h1 className="text-[#5F5E5E]">Service Charge (10%)</h1>
                <h1 className="text-[#5F5E5E] font-[font2] text-[12px]">800</h1>
              </div>
              <div className="flex justify-between font-serif text-lg">
                <h1 className="text-[#5F5E5E]">VAT (13%)</h1>
                <h1 className="text-[#5F5E5E] font-[font2] text-[12px]">800</h1>
              </div>
            </div>
            <div className="flex justify-between font-[font5] text-[#735C00] mt-1 pt-4 border-t border-[#D0C5AF]">
              <h1 className="text-xl">Summation</h1>
              <h1 className="text-4xl">9870</h1>
            </div>
          </div>
        </div>
      </div>

      <div className=" flex justify-center items-center flex-col mt-40">
        <h1 className="uppercase font-[font2] font-semibold text-[14px] [word-spacing:0.5em] [letter-spacing:0.5em] text-[#5F5E5E]">
          GRand Total
        </h1>
        <h1 className="text-[300px] -mt-15 font-[font5]">9870</h1>
        <h1 className="italic text-[#735C00] text-[14px] -mt-20 font-[font5] tracking-tight">
          {" "}
          THE BANQUET PALACE
        </h1>
      </div>

      <div className="bg-red- mt-10">
        <div className=" flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#FDF9F0] rounded-lg  overflow-hidden">
            <div className="flex">
              {/* Left Method */}
              <div className="flex-1 cursor-pointer  px-8 py-12 flex flex-col justify-center items-start border-r border-gray-200">
                <p className="text-xs font-semibold tracking-wider text-gray-600 mb-4">
                  METHOD 01
                </p>
                <h2 className="text-4xl font-serif text-gray-900">
                  Pay in Cash
                </h2>
              </div>

              {/* Right Method */}
              <div className="flex-1 cursor-pointer px-8 py-12 flex flex-col justify-center items-start">
                <p className="text-xs font-semibold tracking-wider text-gray-600 mb-4">
                  METHOD 02
                </p>
                <h2 className="text-4xl font-serif text-gray-900">
                  Digital Transfer
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
