import { LeafyGreen, Smile } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const PayinCash = ({ showcashsuccess, setshowcashsuccess }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-[ #f7faf700] z-50 ${showcashsuccess === true ? "" : "hidden"} backdrop-blur-lg absolute flex items-center justify-center w-screen h-screen top-0`}
    >
      <div className="bg-[#F7FAF7] w-[90%] sm:w-[30%] gap-5 sm:p-0 p-5 items-center flex-col justify-center h-auto  sm:h-[70%] rounded-2xl flex shadow-lg">
        <LeafyGreen color="#4E6050" width={48} height={48} />{" "}
        <h1 className="text-3xl font-[font5]">Payment Tracked</h1>
        <h1 className="font-[font2] text-center sm:w-[60%] w-[80%] text-[#615B54]">
          Your cash settlement has been successfully recorded for final
          processing at the concierge desk.
        </h1>
        <button
          onClick={() => {
            setshowcashsuccess(false);
            navigate("/");
          }}
          className="font-[font2] w-[80%] uppercase cursor-pointer mt-1 rounded-full text-[#F5F6F5] gap-5  h-14 flex items-center justify-center  bg-[#4E6050]"
        >
          <Smile />
          <h1>Done</h1>
        </button>
      </div>
    </div>
  );
};

export default PayinCash;
