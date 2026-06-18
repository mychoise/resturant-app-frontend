import Header from "./header";
import { Minus, Plus, Search, X } from "lucide-react";
import { useState } from "react";

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Starters");
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  console.log(quantities);

  const decreaseQuantity = (itemId: number) => {
    setQuantities((currentQuantities) => ({
      ...currentQuantities,
      [itemId]: Math.max(0, (currentQuantities[itemId] ?? 0) - 1),
    }));
  };

  const increaseQuantity = (itemId: number) => {
    setQuantities((currentQuantities) => ({
      ...currentQuantities,
      [itemId]: (currentQuantities[itemId] ?? 0) + 1,
    }));
  };

  const updateQuantity = (itemId: number, value: string) => {
    setQuantities((currentQuantities) => ({
      ...currentQuantities,
      [itemId]: Math.max(0, Number.parseInt(value, 10) || 0),
    }));
  };

  const menuCategory = [
    {
      id: 1,
      name: "Starters",
    },
    {
      id: 2,
      name: "Beverages",
    },
    {
      id: 3,
      name: "Desserts",
    },
    {
      id: 4,
      name: "Mains",
    },
  ];
  const menuItems = [
    {
      id: 1,
      name: "Heirloom Burrata",
      description: "Fresh burrata, basil pesto, pine nuts, balsamic glaze.",
      price: "$18.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDJbnUT46S7Rl0lraqK5fR4GtrBrArUPOmYMcM9xdF9oI_Osp6SyA6WM9kL41wre9VJZ5YMM4TEIx-5ISkA8I1MY7I-jY7jsQ2JI7w1wEVjJagbOGTk65222fE3X2sQDSdLHExdQ3ThjSGf8M5BrWJ2dfHPHHZC8iumbYQ-BZ7Qo9BHvX1qqDcL9O-fRIo-_ClvtU-vr_CD6U4iqZgAiKX9tBbk9Gmm-PKM5x6yTWWBvIUOSOZEg0La",
    },
    {
      id: 2,
      name: "Heirloom Burrata",
      description: "Fresh burrata, basil pesto, pine nuts, balsamic glaze.",
      price: "$18.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDJbnUT46S7Rl0lraqK5fR4GtrBrArUPOmYMcM9xdF9oI_Osp6SyA6WM9kL41wre9VJZ5YMM4TEIx-5ISkA8I1MY7I-jY7jsQ2JI7w1wEVjJagbOGTk65222fE3X2sQDSdLHExdQ3ThjSGf8M5BrWJ2dfHPHHZC8iumbYQ-BZ7Qo9BHvX1qqDcL9O-fRIo-_ClvtU-vr_CD6U4iqZgAiKX9tBbk9Gmm-PKM5x6yTWWBvIUOSOZEg0La",
    },
    {
      id: 3,
      name: "Heirloom Burrata",
      description: "Fresh burrata, basil pesto, pine nuts, balsamic glaze.",
      price: "$18.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDJbnUT46S7Rl0lraqK5fR4GtrBrArUPOmYMcM9xdF9oI_Osp6SyA6WM9kL41wre9VJZ5YMM4TEIx-5ISkA8I1MY7I-jY7jsQ2JI7w1wEVjJagbOGTk65222fE3X2sQDSdLHExdQ3ThjSGf8M5BrWJ2dfHPHHZC8iumbYQ-BZ7Qo9BHvX1qqDcL9O-fRIo-_ClvtU-vr_CD6U4iqZgAiKX9tBbk9Gmm-PKM5x6yTWWBvIUOSOZEg0La",
    },
  ];
  return (
    <div>
      <div className="flex">
        <div className="w-[77%]">
          <Header />

          {/*search*/}
          <div className="relative w-115 mt-7">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              className="bg-[#F0EDE9] font-[font2] border border-[#C8C7BF] w-full pl-10 p-3 rounded-xl focus:border-[#FED65B] focus:outline-none"
              type="text"
              placeholder="Search menu items..."
            />
          </div>
          {/*list upper*/}
          <div>
            <div className="w-115 flex gap-4 mt-5">
              {menuCategory.map((item, index) => (
                <button
                  key={index}
                  className={`${selectedCategory === item.name ? "bg-black text-white" : "bg-white border border-[#C8C7BF] text-[#474741]"} rounded-3xl pr-5 pl-5 cursor-pointer pb-2 pt-2`}
                  onClick={() => setSelectedCategory(item.name)}
                >
                  <h1 className="font-[font2] tracking-wide">{item.name}</h1>
                </button>
              ))}
            </div>
          </div>

          {/*<hr className="mt-5 border-[#C8C7BF]"></hrs>*/}
          <div className="mt-9 border-t border-[#C8C7BF]  p-10 -ml-10">
            <div className="flex flex-row flex-wrap gap-8">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="w-95 overflow-hidden hover:border-[#735C00] cursor-pointer bg-[#F9F3EB] border border-[#C8C7BF] mb-2 rounded-2xl"
                >
                  <div className="w-full h-50 ">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                    ></img>
                  </div>
                  <div className="p-5 flex gap-2 flex-col">
                    <h1 className="font-[font4] font-bold text-[20px]">
                      {item.name}
                    </h1>
                    <h1 className="font-[font2]">{item.description}</h1>

                    <div className="flex justify-between ">
                      <h1 className="font-[font2] text-[17px] font-bold mt-2">
                        {item.price}
                      </h1>
                      <div className="flex  items-center font-[font2] justify-center border border-[#C8C7BF] rounded-3xl pr-4 pl-4 pt-2 pb-2 gap-2">
                        <Plus size={16} />
                        <button className="cursor-pointer">Add</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-[#FBF8F4] border-l fixed right-0 border-[#C2C1B9] mr-0 -mt-10 h-screen  w-[23%]">
          {/*Heading*/}
          <div className="mt-8">
            <h1 className="text-center font-[font4] tracking-wider text-[32px]">
              GUEST CHECK
            </h1>
            <h1 className="text-center font-[font2] mt-0.5 tracking-widest text-[16px] text-[#474741]">
              THE BANQUET PALACE
            </h1>
          </div>

          {/*Table and guest  diisplay*/}
          <div className=" flex gap-10 justify-evenly border-t border-[#F0EEE8] border-b w-[80%] h-24 ml-10 mt-10">
            <div className="mt-4 ml-7">
              <h1 className="text-[18px] font-[font2] uppercase text-[#474741]">
                Table
              </h1>
              <h1 className="text-[18px] font-[font5] text-center">03</h1>
            </div>
            <div className=" border h-[80%] mt-3 border-[#F0EEE8]"></div>
            <div className="mt-4 mr-7">
              <h1 className="text-[18px]  font-[font2] uppercase text-[#474741]">
                Guests
              </h1>
              <h1 className="text-[18px] font-[font5] text-center">4</h1>
            </div>
          </div>
          {/*Item details*/}

          <div className=" h-120 border-b  overflow-y-auto  w-full pl-8 pr-8 p-5 border-t mt-8  border-[#EBE8E4]">
            <div className=" border-[#EBE8E4] uppercase border-b full pb-3 flex-row text-[16px] tracking-widest font-[font2] text-[#474741] justify-between items-center flex">
              <h1>Item</h1>
              <h1>Price</h1>
            </div>
            <div></div>
            <div className="w-full pt-5">
              {/*ugf*/}
              <div className=" flex mb-6 pb-2 border-[#F0EEE8] border-b-2 justify-between">
                <div className=" flex gap-5">
                  <div className="bg-[#FDFBF9] border border-[#EBE8E4] flex gap-3  flex-col justify-center items-center  w-9 rounded-3xl h-22">
                    <button>
                      <Plus className="text-[#474741]" size={14} />
                    </button>
                    <div className=" w-[70%] pl-2">
                      <input
                        defaultValue={0}
                        type="number"
                        className="w-full font-[font5] outline-0 bg-transparent border-none text-[#181916]"
                      ></input>
                    </div>
                    <button>
                      <Minus className="text-[#474741]" size={14} />
                    </button>
                  </div>
                  <div className="mt-1">
                    <h1 className="font-[font5] text-[#181916] text-[17px]">
                      Heirloom Burrata
                    </h1>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <h1 className="font-[font5] mt-1 ">$36.00</h1>
                  <X
                    size={17}
                    className="-mr-9 text-[#927F83] cursor-pointer mt-2 hover:text-red-500"
                  />
                </div>
              </div>{" "}
            </div>
          </div>
          <div className="w-full h-40  flex items-center justify-center">
            <button
              className={`text-[16px] w-[85%] bg-black cursor-pointer  tracking-widest  text-[#F9F3EB] font-bold mt-5  pt-4 pb-4 uppercase font-[font2]  text-center border border-[#C8C7BF]`}
            >
              Send to kitchen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
