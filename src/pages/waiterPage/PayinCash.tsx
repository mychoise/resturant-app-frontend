import { LeafyGreen, Smile } from "lucide-react";
import React from "react";

const PayinCash = ({ showcashsuccess, setshowcashsuccess }) => {
  return (
    <div
      className={`bg-[ #f7faf700] z-50 ${showcashsuccess === true ? "" : "hidden"} backdrop-blur-2xl absolute flex items-center justify-center w-screen h-screen top-0`}
    >
      <div className="bg-[#F7FAF7] w-[30%] gap-5 items-center flex-col justify-center h-[40%] rounded-2xl flex shadow-lg">
        <LeafyGreen color="#4E6050" width={48} height={48} />{" "}
        <h1 className="text-3xl font-[font5]">Payment Tracked</h1>
        <h1 className="font-[font2] text-center w-[60%] text-[#615B54]">
          Your cash settlement has been successfully recorded for final
          processing at the concierge desk.
        </h1>
        <button
          onClick={() => setshowcashsuccess(false)}
          className="font-[font2] w-[80%] uppercase cursor-pointer mt-1 rounded-full text-[#F5F6F5] gap-5  h-[14%] flex items-center justify-center  bg-[#4E6050]"
        >
          <Smile />
          <h1>Done</h1>
        </button>
      </div>
    </div>
  );
};

export default PayinCash;
