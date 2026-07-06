import Header from "../../components/waiterComponents/header";
import {
  Check,
  CircleCheck,
  CreditCard,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useWaiterStore } from "../../store/waiter.store";
import { data, useNavigate } from "react-router-dom";
import { socket } from "../../lib/socket";
import { getAllOrderedItems } from "../../api/api";
import { useGetMenu, usePreviousOrders } from "../../hooks/auth.hook";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const MenuAddInPrevious = () => {
  const [selectedCategory, setSelectedCategory] = useState(
   "e9ab886b-3ec2-44b6-ba89-36219a535717",
  );
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

  const {data} = useGetMenu()

    console.log("result is ", result?.orderedItem);

    const BREAKPOINT_SM = 640; // Tailwind's sm breakpoint

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);


    const [showCartMobile, setshowCartMobile] = useState(width > BREAKPOINT_SM);

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

  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOrderServeSuccess = (data: any) => {
      console.log("table is", table);
      console.log("data from backend after update is", data?.id);
      toast.success("order updated successfully");
      queryClient.setQueryData(["previous-orders", table?.id], (old: any) => {
        console.log("old data is", old);
        if (!old) return old;
        return {
          ...old,
          orderedItem: old.orderedItem.map((item: any) =>
            item.id === data.id ? { ...item, status: "served" } : item,
          ),
        };
      });
    };

    socket.on("order:served", handleOrderServeSuccess);
    return () => socket.off("order:served", handleOrderServeSuccess);
  }, [table?.id, queryClient]);

  console.log(cartItems);

  const filteredItems = data?.data.filter(
    (item) => item.category_id === selectedCategory,
  );

  function markServed(orderId: string) {
    console.log("order to be marked receive for", orderId);
    socket.emit("order:served", { order_item_id: orderId });
  }

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
    <div className="sm:ml-10 ml-3 mt-10 bg-[#FCF9F5]">
      <div className="flex sm:flex-row flex-col">
        <div className="sm:w-[77%] w-full">
          <Header page="select-menu" />

          {/*search*/}
          <div className="hidden sm:relative w-115 mt-7">
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
            <div className=" flex sm:gap-4 flex-wrap gap-2 sm:mt-5 mt-7 ">
              {data?.category?.map((item, index) => (
                <button
                  key={index}
                  className={`${selectedCategory === item.id ? "bg-black text-white" : "bg-white border border-[#C8C7BF] text-[#474741]"} rounded-3xl pr-5 pl-5 cursor-pointer pb-2 pt-2`}
                  onClick={() => {
                    setSelectedCategory(item.id);
                  }}
                >
                  <h1 className="font-[font2] text-14 tracking-wide">{item.name}</h1>
                </button>
              ))}
            </div>
          </div>

          {/*<hr className="mt-5 border-[#C8C7BF]"></hrs>*/}
          <div className="mt-9 border-t border-[#C8C7BF]  p-10 -ml-10">
            <div
              className={`flex ${curentView === "previous" && "hidden"} none flex-row flex-wrap gap-8`}
            >
              {filteredItems?.map((item) => (
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
              className={`sm:w-95 w-auto p-4 ${curentView === "new" && "hidden"} overflow-hidden hover:border-[#735C00] cursor-pointer bg-[#F9F3EB] border border-[#C8C7BF] mb-2 rounded-2xl`}
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
                    className="flex mt-2 border-t  border-[#D9D9D9] justify-between font-[font2]"
                  >
                    <div className="flex gap-1">
                      <h1>{item.item_name}</h1>
                      <X className="mt-1" size={16} />
                      <span className="text-[#c30000]">{item.quantity}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <h1>${item.price_snapshot}</h1>
                      {item.status === "served" ? (
                        <div className="bg-[#D2DED1] flex text-[#768371] flex-row p-1 pr- pl-2 gap-2 border rounded-xl">
                          <CircleCheck />
                          <span className="text-[#768371]">Served</span>
                        </div>
                      ) : item.status === "ready" ? (
                        <button
                          onClick={() => markServed(item?.id)}
                          className="border text-[#C8DCC9] font-[font2] bg-[#518D55] cursor-pointer pl-3 pr-3 p-1 rounded-xl"
                        >
                          Mark Served
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
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


              <div className={`fixed sm:fixed left-0 pb-20 z-50  sm:left-auto sm:right-0 w-full sm:w-[23%]`}>
                  <div className={`bg-[#FBF8F4] border-l ${showCartMobile ? "" : "hidden"}  overflow-scroll sm:fixed   border-[#C2C1B9] mr-0 -mt-10 h-screen sm:h-screen scroll-auto  left-0 sm:left-auto sm:right-0 w-full sm:w-[23%]`} >
                  <div
                      className="flex sm:hidden  w-full justify-end  items-end pt-5 pr-5">
                      <button onClick={()=>setshowCartMobile(false)}>
                          <X className="text-right" size={"30"} color="red" />

                      </button>
                      </div>
              <h1 className="text-center font-[font4] tracking-wider text-[32px]">
                GUEST CHECK
              </h1>
              <h1 className="text-center font-[font2] mt-0.5 tracking-widest text-[16px] text-[#474741]">
                THE BANQUET PALACE
              </h1>
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
                                    className="w-full font-[font5] outline-0 bg-transparent border-none text-[#18
                                    1916]"
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

          <div className="bg-yellow-300 bottom-5 z-10 fixed sm:hidden right-5 flex items-center justify-center w-15 rounded-full h-15">
              <button onClick={()=>setshowCartMobile(true)}>
                  <ShoppingCart />
              </button>
              </div>
    </div>
  );
};

export default MenuAddInPrevious;
