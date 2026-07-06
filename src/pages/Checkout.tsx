import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePay, usePreviousOrders } from "../hooks/auth.hook";
import { useWaiterStore } from "../store/waiter.store";
import PayinCash from "./waiterPage/PayinCash";
import PayinEsewa from "./waiterPage/PayinEsewa";

const Checkout = () => {
  const [show, setshow] = useState(false);

  const [showcashsuccess, setshowcashsuccess] = useState(false);
  const [showEsewasuccess, setshowEsewasuccess] = useState(false);
  const { table } = useWaiterStore();
  const { data, isLoading, isError } = usePreviousOrders(table?.id || "");
  const navigate = useNavigate();
  console.log("data is", data);
  console.log("table is", table);

  useEffect(() => {
    if (!table || !data) {
      console.log("No table or data found, redirecting to home.");
      navigate("/");
    }
  }, [navigate, table, data]);

  const { mutate } = usePay();

  const payInCash = () => {
    const payload: {
      order_id: string;
      table_id: string;
      payment_type: "cash" | "online";
    } = {
      order_id: data?.order?.id,
      table_id: table?.id,
      payment_type: "cash",
    };
    mutate(payload, {
      onSuccess: (response) => {
        console.log("Payment successful:", response);
        setshowcashsuccess(true);
      },
      onError: (error) => {
        console.error("Payment failed:", error);
        setshowcashsuccess(false);
      },
    });
  };

  const payInEsewa = () => {
    const payload: {
      order_id: string;
      table_id: string;
      payment_type: "cash" | "online";
    } = {
      order_id: data?.order?.id,
      table_id: table?.id,
      payment_type: "online",
    };
    mutate(payload, {
      onSuccess: (response) => {
        console.log("Payment successful:", response);
        setshowEsewasuccess(true);
      },
      onError: (error) => {
        console.error("Payment failed:", error);
        setshowEsewasuccess(false);
      },
    });
  };

  return (
    <div className="bg-[#FDF9F0] overflow-x-hidden h-screen w-screen pt-10">
      <PayinCash
        showcashsuccess={showcashsuccess}
        setshowcashsuccess={setshowcashsuccess}
      />
      <PayinEsewa
        showEsewasuccess={showEsewasuccess}
        setshowEsewasuccess={setshowEsewasuccess}
      />
      <Link to={"/"} className="text-[#735C00] pl-8 font-[font5] sm:text-[48px] text-2xl ">
        THE BANQUET PALACE
      </Link>

      <div className=" flex   mb-4 justify-center pt-10 items-center flex-col ">
        <div
          onClick={() => setshow(!show)}
          className="text-[#1C1C16] hover:text-[#735C00] transition-colors cursor-pointer flex items-center flex-col"
        >
          <h1 className="sm:text-[45px] text-2xl tracking-wide  font-[font5] ">
            View Particulars
          </h1>
          <ChevronDown
            className={` z-0 transition-all duration-500 ${show ? "rotate-180" : "rotate-0"}`}
          />
        </div>
      </div>
      <div
        className={`w-screen -pl-20 flex ${show ? "opacity-100" : "hidden opacity-0"} transition-all duration-1000 items-center justify-center`}
      >
        <div className=" border-t p-5  border-[#735C00] pt-7 w-120">
          {data?.orderedItem?.map((item, index) => (
            <div key={index} className="flex justify-between mb-3">
              <div className="flex font-serif gap-4 text-lg">
                <h1 className="text-[#797877]">{index + 1}.</h1>
                <h1>{item.item_name}</h1>
              </div>
              <h1 className="font-[font5] text-lg">${item.price_snapshot}</h1>
            </div>
          ))}

          <div>
            <div className="border-t flex flex-col  border-[#D0C5AF] border-dotted">
              <div className="flex justify-between font-serif text-lg pt-2">
                <h1 className="text-[#5F5E5E]">Subtotal</h1>
                <h1 className="text-[#5F5E5E] font-[font2] text-[12px]">
                  ${data?.order?.total_price}
                </h1>
              </div>
              <div className="flex justify-between font-serif text-lg ">
                <h1 className="text-[#5F5E5E]">Service Charge (10%)</h1>
                <h1 className="text-[#5F5E5E] font-[font2] text-[12px]">0</h1>
              </div>
              <div className="flex justify-between font-serif text-lg">
                <h1 className="text-[#5F5E5E]">VAT (13%)</h1>
                <h1 className="text-[#5F5E5E] font-[font2] text-[12px]">0</h1>
              </div>
            </div>
            <div className="flex justify-between font-[font5] text-[#735C00] mt-1 pt-4 border-t border-[#D0C5AF]">
              <h1 className="text-xl">Summation</h1>
              <h1 className="text-4xl">${data?.order?.total_price}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className=" flex gap-10 sm:gap-20 justify-center items-center flex-col mt-20 sm:mt-40">
        <h1 className="uppercase font-[font2] font-semibold text-[14px] [word-spacing:0.5em] [letter-spacing:0.5em] text-[#5F5E5E]">
          GRand Total
        </h1>
        <h1 className="sm:text-[300px] text-9xl sm:-mt-15 font-[font5]">
          ${data?.order.total_price}
        </h1>
        <h1 className="italic text-[#735C00] text-[14px] sm:-mt-20 font-[font5] tracking-tight">
          {" "}
          THE BANQUET PALACE
        </h1>
      </div>

      <div className="bg-red- mt-10">
        <div className=" flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#FDF9F0] rounded-lg  overflow-hidden">
            <div className="flex">
              {/* Left Method */}
              <button
                onClick={() => payInCash()}
                className="flex-1 cursor-pointer   sm:px-8 sm:py-12 py-3 flex flex-col justify-center items-start border-r border-gray-200"
              >
                <p className="text-xs font-semibold tracking-wider text-gray-600 mb-4">
                  METHOD 01
                </p>
                <h2 className="sm:text-4xl text-2xl  font-serif text-gray-900">
                  Pay in Cash
                </h2>
              </button>

              {/* Right Method */}
              <button
                onClick={() => payInEsewa()}
                className="flex-1 cursor-pointer sm:px-8 px-2 sm:py-12 py-3 flex flex-col justify-center items-start"
              >
                <p className="text-xs font-semibold tracking-wider text-gray-600 mb-4">
                  METHOD 02
                </p>
                <h2 className="sm:text-4xl w-full text-2xl font-serif text-gray-900">
                  Digital Transfer
                </h2>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
