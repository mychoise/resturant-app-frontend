import { useEffect } from "react";
import { Check, Grid2x2, Printer } from "lucide-react";
import { useWaiterStore } from "../../store/waiter.store";
import { useNavigate } from "react-router-dom";

const MenuAddedSucess = () => {
  // const items = [
  //   { qty: 2, name: "Heirloom Burrata", price: 36.0 },
  //   { qty: 1, name: "Seasonal Salad", price: 18.0 },
  //   { qty: 1, name: "San Pellegrino 750ml", price: 9.0 },
  // ];
  const { table, cart: items } = useWaiterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!table || items.length === 0) {
      navigate("/");
    }
  }, [table, items, navigate]);

  const total = items.reduce((sum, item) => sum + item.price, 0);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className=" w-150 h-180">
        <div className="">
          <div className="w-24 h-24 bg-[#FED65B] ml-27 flex items-center justify-center rounded-full">
            <div className="w-10 h-10 text-center  flex items-center justify-center bg-[#745C00] rounded-full">
              <Check className="text-[#FED65B]" size={30} />
            </div>
          </div>
          <h1 className="font-[font4] text-center text-3xl mt-3">
            Order Sent Successfully
          </h1>
          <h1 className="text-center font-[font2]  text-[#474741] mt-1">
            Kitchen has received order for Table 04
          </h1>
        </div>
        {/*fgiggefgw8ohwhgeriigihgihis*/}
        <div>
          <div className="w-full mt-3 border border-[#C8C7BF]  bg-[#FBF6EE] rounded-xl shadow-md px-6 py-6 font-serif">
            {/* Header */}
            <div className="flex items-start justify-between">
              <span className="text-[16px] font-[font2]  font-bold tracking-widest text-amber-700 uppercase">
                Guest Check
              </span>
              <span className="text-[16px] font-[font1] text-stone-500">
                #88429
              </span>
            </div>

            <div className="flex items-center justify-between mt-1">
              <h1 className="text-xl font-[font4] font-bold text-stone-900">
                Table No: {table?.table_number}
              </h1>
              <span className="text-[16px] font-[font2] text-stone-500">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <p className="text-[15px] font-[font2] text-stone-600 mt-1">
              Covers: 2 &bull; Waiter: John
            </p>

            {/* Dotted divider */}
            <div className="border-t border-dashed border-stone-400 my-4" />

            {/* Items */}
            <ul className="space-y-3">
              {items.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between text-stone-900 font-[font2] "
                >
                  <span>
                    {item.quantity}
                    <span className="mx-1 font-[font2]">&times;</span>
                    {item.name}
                  </span>
                  <span>${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>

            {/* Solid divider */}
            <div className="border-t-2 border-stone-900 my-5" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-stone-900">TOTAL</span>
              <span className="text-3xl font-bold text-stone-900">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Footer */}
            <p className="text-center text-[17px] font-[font2] tracking-widest text-stone-400 uppercase mt-6">
              The Banquet Palace
            </p>
          </div>
        </div>
        <div className="flex gap-3 ">
          <button
            className={`text-[16px] flex items-center justify-center gap-3 w-[85%] rounded-xl bg-[#FCF9F5] cursor-pointer  tracking-widest   text-black font-bold mt-5  pt-4 pb-4 uppercase font-[font2]  text-center border `}
          >
            <Printer />
            Print Receipt
          </button>
          <button
            onClick={() => navigate("/")}
            className={`text-[16px] flex items-center justify-center gap-3 w-[85%] rounded-xl bg-black cursor-pointer  tracking-widest  text-[#F9F3EB] font-bold mt-5  pt-4 pb-4 uppercase font-[font2]  text-center border border-[#C8C7BF]`}
          >
            <Grid2x2 />
            Back to Floor Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuAddedSucess;
