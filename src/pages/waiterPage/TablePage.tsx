import { useState, useEffect } from "react";
import Header from "../../components/waiterComponents/header";
import LeftPart from "../../components/waiterComponents/LeftPart";
import RightPart from "../../components/waiterComponents/RightPart";
import { useWaiterStore } from "../../store/waiter.store";
import { socket } from "../../lib/socket";
import toast from "react-hot-toast";
import { Howl } from "howler";
import { playOrderSound } from "../../lib/sound";
const TablePage = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const { setTable, removeCart } = useWaiterStore();

  const showOrderStatusToast = (
    itemName: string,
    tableNumber: string,
    status: "preparing" | "ready",
  ) => {
    const isPreparing = status === "preparing";
    if (status === "ready") {
      playOrderSound();
    }
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"} w-[300px] rounded-xl overflow-hidden border border-gray-200 shadow-lg bg-white`}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 border-b"
            style={{
              background: isPreparing ? "#FAEEDA" : "#EAF3DE",
              borderColor: isPreparing ? "#EF9F27" : "#97C459",
            }}
          >
            <i
              className={`ti ${isPreparing ? "ti-clock" : "ti-check"} text-[15px]`}
              style={{ color: isPreparing ? "#633806" : "#27500A" }}
            />
            <span
              className="text-[11px] font-medium uppercase tracking-widest"
              style={{ color: isPreparing ? "#633806" : "#27500A" }}
            >
              {isPreparing ? "Now preparing" : "Order ready"}
            </span>
            <span
              className="ml-auto text-[11px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: isPreparing ? "#EF9F27" : "#639922",
                color: isPreparing ? "#412402" : "#EAF3DE",
              }}
            >
              Table {tableNumber}
            </span>
          </div>

          {/* Body */}
          <div className="flex gap-2.5 items-start p-3">
            <div
              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: isPreparing ? "#FAEEDA" : "#EAF3DE" }}
            >
              <i
                className={`ti ${isPreparing ? "ti-tools-kitchen-2" : "ti-circle-check"} text-[18px]`}
                style={{ color: isPreparing ? "#BA7517" : "#3B6D11" }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-0.5">
                {itemName}
              </p>
              <p className="text-xs text-gray-500">
                {isPreparing
                  ? "Your order is being prepared in the kitchen."
                  : `Order is ready — please serve table ${tableNumber}.`}
              </p>
            </div>
          </div>
        </div>
      ),
      { duration: 5000, position: "top-right" },
    );
  };

  useEffect(() => {
    removeCart();
    setTable(selectedTable);
  }, [selectedTable, setTable]);

  useEffect(() => {
    socket.on("order:update", (data) => {
      console.log("REceived order update for", data);
      const { item_name, table, status } = data;
      console.log(
        "Received order update for",
        item_name,
        "at table",
        table,
        "with status",
        status,
      );
      showOrderStatusToast(item_name, table, status);
    });
    return () => {
      socket.off("order:update");
    };
  });

  return (
    <div className="ml-10 mt-10 bg-[#FCF9F5]">
      <Header page="select-table" />
      <div className="flex mt-10 gap-10">
        {/* left part */}
        <LeftPart
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
        />

        {/* //right part */}
        <RightPart selectedTable={selectedTable} />
      </div>
    </div>
  );
};

export default TablePage;
