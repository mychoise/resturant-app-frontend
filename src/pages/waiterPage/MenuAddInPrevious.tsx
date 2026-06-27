import Header from "../../components/waiterComponents/header";
import { CreditCard, Minus, Plus, Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { menuCategory, menuItems } from "../../constants/constants";
import { useWaiterStore } from "../../store/waiter.store";
import { data, useNavigate } from "react-router-dom";
import { socket } from "../../lib/socket";
import { getAllOrderedItems } from "../../api/api";
import { usePreviousOrders } from "../../hooks/auth.hook";

const MenuAddInPrevious = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    "13a310e8-c43f-4edf-adbb-aedcecbc1e29",
  );
  // const [cartItems, setCartItems] = useState<any>([]);
  const navigate = useNavigate();
  const {
    table,
    cart: cartItems,
    addToCart,
    increaseQantity,
    decreaseQantity,
    deleteItem,
  } = useWaiterStore();

  const [curentView, setCurrentView] = useState<"new" | "previous">("new");
  const {
    data: result,
    isLoading,
    isError,
  } = usePreviousOrders(table?.id || "");

  console.log("result is ", result?.orderedItem);

  const orderData = null;

  useEffect(() => {
    if (!table) {
      navigate("/");
    }
  }, [table, navigate]);

  useEffect(() => {
    const handleOrderCreated = (order: any) => {
      console.log("order saved:", order);
      navigate("/success");
    };

    const handleOrderStatus = (order: any) => {
      if (order.status === "ready") {
        alert("ready");
      }
    };

    socket.on("order:created", handleOrderCreated);
    socket.on("order:status", handleOrderStatus);

    return () => {
      socket.off("order:created", handleOrderCreated);
      socket.off("order:status", handleOrderStatus);
    };
  }, []);

  console.log(cartItems);

  const filteredItems = menuItems.filter(
    (item) => item.category_id === selectedCategory,
  );

  function sendToKitchen() {
    try {
      if (!table?.id) {
        console.error("Cannot send order without a selected table.");
        return;
      }

      if (cartItems.length === 0) {
        console.error("Cannot send an empty order to the kitchen.");
        return;
      }

      const payload = {
        table_id: table.id,
        // payment_method: "cash",
        order_id: result?.order?.id || null,
        items: cartItems.map((item) => ({
          menu_item_id: item.id,
          item_name: item.name,
          quantity: item.quantity,
        })),
      };

      const emitOrder = () => {
        socket
          .timeout(9000)
          .emit(
            "order:addInPrevious",
            payload,
            (err: Error | null, response: unknown) => {
              if (err) {
                console.error("Failed to deliver order to the backend:", err);
                return;
              }

              console.log("ACK received:", response);
            },
          );
      };

      if (!socket.connected) {
        socket.connect();
        socket.once("connect", emitOrder);
        return;
      }

      emitOrder();
    } catch (error) {
      console.log("error is ", error);
    }
  }
  return (
    <div className="ml-10 mt-10 bg-[#FCF9F5]">
      <div className="flex">
        <div className="w-[77%]">
          <Header page="select-menu" />

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
            <div
              className={`flex gap-8 mt-9 font-[font2] border-b  border-[#C8C7BF] pb-3  gap-4 `}
            >
              <button
                onClick={() => setCurrentView("new")}
                className={`cursor-pointer ${curentView === "new" ? "text-black" : "text-[#474741]"} text-[17px]`}
              >
                New Order
              </button>
              <button
                onClick={() => setCurrentView("previous")}
                className={`cursor-pointer ${curentView === "previous" ? "text-black" : "text-[#474741]"} text-[17px]`}
              >
                Previous Order
              </button>
            </div>
            <div className=" flex gap-4 mt-5">
              {menuCategory.map((item, index) => (
                <button
                  key={index}
                  className={`${selectedCategory === item.id ? "bg-black text-white" : "bg-white border border-[#C8C7BF] text-[#474741]"} rounded-3xl pr-5 pl-5 cursor-pointer pb-2 pt-2`}
                  onClick={() => {
                    setSelectedCategory(item.id);
                  }}
                >
                  <h1 className="font-[font2] tracking-wide">{item.name}</h1>
                </button>
              ))}
            </div>
          </div>

          {/*<hr className="mt-5 border-[#C8C7BF]"></hrs>*/}
          <div className="mt-9 border-t border-[#C8C7BF]  p-10 -ml-10">
            <div
              className={`flex ${curentView === "previous" && "hidden"} none flex-row flex-wrap gap-8`}
            >
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="w-95 overflow-hidden hover:border-[#735C00] cursor-pointer bg-[#F9F3EB] border border-[#C8C7BF] mb-2 rounded-2xl"
                >
                  {/*<div className="w-full h-50 ">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                    ></img>
                  </div>*/}
                  <div className="p-5 flex gap-2 flex-col">
                    <h1 className="font-[font4] font-bold text-[20px]">
                      {item.name}
                    </h1>
                    <h1 className="font-[font2]">{item.description}</h1>

                    <div className="flex justify-between ">
                      <h1 className="font-[font2] text-[17px] font-bold mt-2">
                        ${item.price}
                      </h1>
                      {cartItems.some(
                        (cartItem: any) => cartItem.id === item.id,
                      ) ? (
                        <div className="w-31.7">
                          <div className="flex items-center gap-2 bg-[#F0EDE9] border border-[#FED65B] rounded-full px-3 py-1">
                            <button
                              onClick={() => {
                                decreaseQantity(item.id);
                              }}
                              className="text-gray-400 hover:text-gray-600 text-xl w-7 h-7 flex items-center justify-center transition"
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              readOnly={true}
                              value={
                                cartItems.find(
                                  (cartItem: any) => cartItem.id === item.id,
                                )?.quantity || 0
                              }
                              type="number"
                              className="w-8 text-center font-[font5] text-gray-900 bg-transparent border-none outline-none"
                            />
                            <button
                              onClick={() => increaseQantity(item.id)}
                              className="bg-yellow-300 hover:bg-yellow-400 text-gray-800 text-xl w-8 h-8 flex items-center justify-center rounded-full transition font-bold"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex  items-center font-[font2] justify-center border border-[#C8C7BF] rounded-3xl pr-4 pl-4 pt-2 pb-2 gap-2">
                          <Plus size={16} />
                          <button
                            onClick={() => addToCart(item)}
                            className="cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`w-95 p-4 ${curentView === "new" && "hidden"} overflow-hidden hover:border-[#735C00] cursor-pointer bg-[#F9F3EB] border border-[#C8C7BF] mb-2 rounded-2xl`}
            >
              <div className="flex justify-between font-[font2]">
                <div className="bg-red-200 p-2 pl-3 pr-3 rounded-2xl">
                  <h1>
                    Order #
                    {String(result?.order?.id).replace(/-/g, "").slice(-4)}
                  </h1>{" "}
                </div>
                <h1>12:30</h1>
              </div>
              <div className="mt-3">
                {result?.orderedItem?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between font-[font2]"
                  >
                    <div className="flex gap-1">
                      <h1>{item.item_name}</h1>
                      <X className="mt-1" size={16} />
                      <span className="text-[#c30000]">{item.quantity}</span>
                    </div>
                    <h1>${item.price_snapshot}</h1>
                  </div>
                ))}

                <div className="flex mt-2 border-[#C8C7BF] border-t p-1 font-[font2] justify-between">
                  <h1>Total</h1>
                  <h1>${result?.order.total_price}</h1>
                </div>
              </div>
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
              <h1 className="text-[18px] font-[font5] text-center">
                {String(table?.table_number).padStart(2, "0")}
              </h1>
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
              {cartItems.length === 0 && (
                <div className=" w-full h-90 items-center justify-center flex">
                  <h1 className="font-[font2] text-[#474741] text-[16px]">
                    NO ITEM IN CART
                  </h1>
                </div>
              )}

              {cartItems.map((item: any) => (
                <div
                  key={item.id}
                  className=" flex mb-6 pb-2 border-[#F0EEE8] border-b-2 justify-between"
                >
                  <div className=" flex gap-5">
                    <div className="bg-[#FDFBF9] border border-[#EBE8E4] flex gap-3  flex-col justify-center items-center  w-9 rounded-3xl h-22">
                      <button onClick={() => increaseQantity(item.id)}>
                        <Plus className="text-[#474741]" size={14} />
                      </button>
                      <div className=" w-[70%] pl-2">
                        <input
                          readOnly={true}
                          value={
                            cartItems.find(
                              (cartItem: any) => cartItem.id === item.id,
                            )?.quantity || 0
                          }
                          type="number"
                          className="w-full font-[font5] outline-0 bg-transparent border-none text-[#181916]"
                        ></input>
                      </div>
                      <button onClick={() => decreaseQantity(item.id)}>
                        <Minus className="text-[#474741]" size={14} />
                      </button>
                    </div>
                    <div className="mt-1">
                      <h1 className="font-[font5] text-[#181916] text-[17px]">
                        {item.name}
                      </h1>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <h1 className="font-[font5] mt-1 ">${item.price}</h1>
                    <X
                      onClick={() => deleteItem(item.id)}
                      size={17}
                      className="-mr-9 text-[#927F83] cursor-pointer mt-2 hover:text-red-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full h-40  flex items-center justify-between flex-col">
            <button
              onClick={() => sendToKitchen()}
              className={`text-[16px] w-[85%] bg-black cursor-pointer  tracking-widest  text-[#F9F3EB] font-bold mt-5  pt-4 pb-4 uppercase font-[font2]  text-center border border-[#C8C7BF]`}
            >
              Send to kitchen
            </button>{" "}
            <button
              onClick={() => navigate("/checkout")}
              className={`text-[16px] flex items-center justify-center gap-6 w-[85%] bg-black cursor-pointer  tracking-widest  text-[#F9F3EB] font-bold mt-5  pt-4 pb-4 uppercase font-[font2]  text-center border border-[#C8C7BF]`}
            >
              <CreditCard />
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuAddInPrevious;
