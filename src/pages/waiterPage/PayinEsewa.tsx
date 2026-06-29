import { LeafyGreen, Smile } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const PayinEsewa = ({ showEsewasuccess, setshowEsewasuccess }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-[ #f7faf700] z-50 ${showEsewasuccess === true ? "" : "hidden"} backdrop-blur-2xl absolute flex items-center justify-center w-screen h-screen top-0`}
    >
      <div className="bg-[#F7FAF7] w-[30%] gap-5 items-center flex-col justify-center h-[70%] rounded-2xl flex shadow-lg">
        <LeafyGreen color="#4E6050" width={48} height={48} />{" "}
        <h1 className="text-3xl font-[font5]">Payment Tracked</h1>
        <h1 className="font-[font2] text-center w-[60%] text-[#615B54]">
          In order to pay for our service , please scan the QR code provided
          below using your{" "}
          <span className="text-[#5FB946] font-bold">eSewa app</span> .
        </h1>
        <div className="h-60 w-60 bg-amber-500 ">
          <img className="object-contain" src="/qr.png"></img>
        </div>
        <button
          onClick={() => {
            setshowEsewasuccess(false);
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

export default PayinEsewa;
