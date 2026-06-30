import { useEffect, useState } from "react";
import { Check, ChevronsRight } from "lucide-react";
import { socket } from "../../lib/socket";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Howl } from "howler";
import { playOrderSound } from "../../lib/sound";

type OrderItem = {
  id: string;
  menu_item_id: string;
  item_name: string;
  quantity: number;
  status: "pending" | "preparing" | "ready" | "served";
  order_id?: string;
};

type Order = {
  id: string;
  table_id: string;
  table_number?: number;
  status: string;
  items: OrderItem[];
  ordered_at?: string;
};

type ServedTicket = {
  id: string;
  meta: string;
  summary: string;
};

const STATUS_FLOW: Record<string, string> = {
  pending: "preparing",
  preparing: "ready",
  ready: "served",
};

const STATUS_OPTIONS: { value: OrderItem["status"]; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "served", label: "Served" },
];

const COLUMN_META: Record<string, { title: string; dotColor: string }> = {
  pending: { title: "Pending", dotColor: "#9ca3af" },
  preparing: { title: "Preparing", dotColor: "#fb923c" },
  ready: { title: "Ready", dotColor: "#4ade80" },
};

function getOrderMeta(order: Order) {
  console.log("order i received is", order);
  return `Table ${order.table_number ?? order.table_id}`;
}

function normalizeOrderPayload(payload: any): Order | null {
  console.log("order normalized payload receivd is", payload);
  const raw = payload?.order ?? payload;
  if (!raw || !raw.id) return null;
  const table = payload?.table;

  return {
    id: raw.id,
    table_id: raw.table_id,
    table_number: raw.table_number || table.table_number,
    status: raw.status ?? "pending",
    ordered_at: raw.ordered_at,
    items: Array.isArray(raw.items)
      ? raw.items.map((item: any) => ({
          id: item.id,
          menu_item_id: item.menu_item_id,
          item_name: item.item_name,
          quantity: item.quantity,
          status: item.status ?? "pending",
          order_id: item.order_id ?? raw.id,
        }))
      : [],
  };
}

function ItemRow({
  item,
  onAdvance,
  onSetStatus,
}: {
  item: OrderItem;
  order: Order;
  onAdvance: (orderItemId: string, currentStatus: string) => void;
  onSetStatus: (orderItemId: string, newStatus: string) => void;
}) {
  const buttonLabel =
    item.status === "pending"
      ? "Start"
      : item.status === "preparing"
        ? "Ready"
        : item.status === "ready"
          ? "Serve"
          : null;

  return (
    <div className="flex items-center justify-between gap-2 mb-2 bg-white/[0.03] p-[10px] rounded-lg flex-wrap">
      <div className="flex items-center gap-2">
        <span className="bg-white/[0.08] text-[#d4d4d8] text-[11px] font-bold py-0.5 px-1.5 rounded w-[22px] text-center">
          {item.quantity}x
        </span>
        <span className="text-sm text-[#e4e4e7]">{item.item_name}</span>
      </div>

      <div className="flex items-center gap-2">
        {buttonLabel && (
          <button
            onClick={() => onAdvance(item.id, item.status)}
            className={`rounded-[7px] px-3 py-1.5 text-[12.5px] font-semibold cursor-pointer flex items-center gap-1 ${
              item.status === "pending"
                ? "bg-blue-500 text-white"
                : item.status === "preparing"
                  ? "bg-amber-500 text-black"
                  : "bg-green-500/25 text-[#86efac] border border-green-500/40"
            }`}
          >
            {item.status === "ready" && <Check size={13} />}
            {buttonLabel}
          </button>
        )}

        {item.status === "served" && (
          <span className="text-xs text-[#4ade80] font-semibold flex items-center gap-1">
            <Check size={13} />
            Served
          </span>
        )}
      </div>
    </div>
  );
}

function TicketCard({
  order,
  onAdvanceItem,
  onSetItemStatus,
}: {
  order: Order;
  onAdvanceItem: (orderItemId: string, currentStatus: string) => void;
  onSetItemStatus: (orderItemId: string, newStatus: string) => void;
}) {
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-[10px] mb-3 overflow-hidden">
      <div className="flex justify-between items-start p-3.5 pb-2.5">
        <div>
          <div className="font-bold text-lg text-[#93c5fd]">
            {order.items[0].order_id}
          </div>
          <div className="text-[12.5px] text-[#a1a1aa] mt-0.5">
            {console.log("order meta is", order)}
            {getOrderMeta(order)}
          </div>
        </div>
      </div>

      <div className="px-3.5 pb-3.5">
        {order.items.length === 0 ? (
          <div className="text-[12.5px] text-[#71717a]">No items</div>
        ) : (
          order.items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              order={order}
              onAdvance={onAdvanceItem}
              onSetStatus={onSetItemStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="w-2 h-2 rounded-full inline-block"
        style={{ background: color }}
      />
      <span className="text-[#a1a1aa]">{label}</span>
    </div>
  );
}

function ColumnHeader({
  dotColor,
  title,
  count,
}: {
  dotColor: string;
  title: string;
  count: number;
}) {
  return (
    <div className="flex justify-between items-center mb-3.5">
      <div className="flex items-center gap-2 text-xs font-bold tracking-[0.5px] text-[#d4d4d8]">
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ background: dotColor }}
        />
        {title.toUpperCase()}
      </div>
      <span className="bg-[#27272a] text-[#d4d4d8] text-xs font-bold px-2 py-0.5 rounded">
        {count}
      </span>
    </div>
  );
}

export default function WorkflowBoard() {
  const [orders, setOrders] = useState<Record<string, Order>>({});
  const [served, setServed] = useState<ServedTicket[]>([]);

  useEffect(() => {
    async function loadInitialOrders() {
      try {
        const res = await axiosInstance.get("/order/all");
        console.log("res is", res.data);
        const data = res.data;
        console.log("data asgdgu", data.updatedItem);
        const initialOrders: Record<string, Order> = {};
        const initialServed: ServedTicket[] = [];

        (data.orders ?? []).forEach((raw: any) => {
          const order = normalizeOrderPayload(raw);
          console.log("fuckingg order is", order);
          if (!order) return;

          const allServed = order.items.every((i) => i.status === "served");

          if (allServed) {
            initialServed.push({
              id: order.id,
              meta: `${getOrderMeta(order)} • Served`,
              summary: order.items
                .map((i) => `${i.quantity}x ${i.item_name}`)
                .join(", "),
            });
          } else {
            initialOrders[order.id] = order;
          }
        });

        setOrders(initialOrders);
        setServed(initialServed);
      } catch (err) {
        console.error("Failed to load initial orders:", err);
      }
    }

    loadInitialOrders();
  }, []);

  useEffect(() => {
    socket.on("order:new", (payload: any) => {
      const order = normalizeOrderPayload(payload);
      console.log("the fucking order is", order);
      if (!order) {
        console.warn("order:new unexpected payload shape:", payload);
        return;
      }
      setOrders((prev) => ({ ...prev, [order.id]: order }));
    });

    socket.on("order:addInPrevious", (payload: any) => {
      const order = normalizeOrderPayload(payload);
      if (!order) return;

      setOrders((prev) => {
        const existingOrder = prev[order.id];

        return {
          ...prev,
          [order.id]: {
            ...existingOrder,
            ...order,
            items: [...(existingOrder?.items || []), ...order.items],
          },
        };
      });
    });

    socket.on("order:alert", (payload: any) => {
      playOrderSound();

      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} w-[340px] rounded-[14px] overflow-hidden border border-[#2a2825] shadow-2xl bg-[#1c1917]`}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#78350f]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                  Kitchen Alert
                </span>
              </div>
              <span className="text-[11px] font-medium text-amber-300 bg-[#92400e] px-2.5 py-0.5 rounded-full">
                Table {payload.tableNumber}
              </span>
            </div>

            {/* Body */}
            <div className="flex gap-3 items-start px-4 py-3.5">
              <div className="flex-shrink-0 w-10 h-10 rounded-[10px] bg-[#292524] border border-[#3a3532] flex items-center justify-center">
                <span className="text-amber-400 text-lg">🍽</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-white mb-1">
                  Order pending
                </p>
                <p className="text-xs text-[#a8a29e] leading-snug">
                  {payload.msg}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#2a2825] px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs text-[#57534e]">Just now</span>
              <div className="flex gap-2">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="text-xs text-[#a8a29e] bg-[#292524] border border-[#3a3532] px-3 py-1 rounded-lg"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ),
        { duration: 6000, position: "top-right" },
      );
      console.log("payload is", payload);
    });

    socket.on("order:update", (updatedItem: any) => {
      if (!updatedItem || !updatedItem.order_id) {
        console.warn("order:update unexpected payload:", updatedItem);
        return;
      }
      console.log("updated item is", updatedItem);
      setOrders((prev) => {
        const next = { ...prev };
        const existing = next[updatedItem.order_id];
        if (!existing) return prev;

        const updatedItems = existing.items.map((item) =>
          item.id === updatedItem.id
            ? { ...item, status: updatedItem.status }
            : item,
        );

        next[updatedItem.order_id] = { ...existing, items: updatedItems };
        return next;
      });
    });

    socket.on("order:served", (updatedItem: any) => {
      if (!updatedItem || !updatedItem.order_id) {
        console.warn("order:served unexpected payload:", updatedItem);
        return;
      }
      setOrders((prev) => {
        const next = { ...prev };
        const existing = next[updatedItem.order_id];
        if (!existing) return prev;

        const updatedItems = existing.items.map((item) =>
          item.id === updatedItem.id ? { ...item, status: "served" } : item,
        );

        const allServed = updatedItems.every(
          (item) => item.status === "served",
        );

        if (allServed) {
          setServed((current) => [
            {
              id: existing.id,
              meta: `${getOrderMeta(existing)} • Served just now`,
              summary: updatedItems
                .map((item) => `${item.quantity}x ${item.item_name}`)
                .join(", "),
            },
            ...current,
          ]);
          delete next[updatedItem.order_id];
          return next;
        }

        next[updatedItem.order_id] = { ...existing, items: updatedItems };
        return next;
      });
    });

    return () => {
      socket.off("order:new");
      socket.off("order:update");
      socket.off("order:served");
      socket.off("order:addInPrevious");
    };
  }, []);

  function advanceItem(orderItemId: string, currentStatus: string) {
    const nextStatus = STATUS_FLOW[currentStatus];
    setItemStatus(orderItemId, nextStatus);
  }

  function setItemStatus(orderItemId: string, newStatus: string) {
    if (newStatus === "served") {
      socket.emit("order:served", { order_item_id: orderItemId });
    } else {
      socket.emit("order:update", {
        order_item_id: orderItemId,
        status: newStatus,
      });
    }
  }

  function getOrderColumn(
    order: Order,
  ): "pending" | "preparing" | "ready" | "served" {
    console.log("items are ", order);
    const items = order.items ?? [];
    if (items.length === 0) return "pending";
    const statuses = items.map((i) => i.status);
    if (statuses.some((s) => s === "pending")) return "pending";
    if (statuses.some((s) => s === "preparing")) return "preparing";
    if (statuses.some((s) => s === "ready")) return "ready";
    return "served";
  }

  const columnBuckets: Record<string, Order[]> = {
    pending: [],
    preparing: [],
    ready: [],
    served: [],
  };

  Object.values(orders)
    .sort(
      (a, b) =>
        new Date(b.ordered_at ?? 0).getTime() -
        new Date(a.ordered_at ?? 0).getTime(),
    )
    .forEach((order) => {
      console.log("machikni order is", order);
      const col = getOrderColumn(order);
      console.log("order is", order, "col is", col);
      columnBuckets[col].push(order);
    });

  const order_columns_priority = ["pending", "preparing", "ready"];
  const totalActive = Object.values(orders).length;

  return (
    <div className="bg-[#0a0a0a] min-h-screen px-7 py-8 font-sans text-white">
      <div className="flex justify-between items-end mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold m-0">Workflow Board</h1>
          <p className="text-[#a1a1aa] text-sm mt-1.5">
            {totalActive} active tickets across all stations.
          </p>
        </div>

        <div className="flex gap-4.5 text-[13.5px]">
          <Legend color="#9ca3af" label="Pending" />
          <Legend color="#fb923c" label="Preparing" />
          <Legend color="#4ade80" label="Ready" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4.5">
        {order_columns_priority.map((colId) => {
          const meta = COLUMN_META[colId];
          console.log("yo meta cai", meta);
          const colOrders = columnBuckets[colId];
          console.log("yo colOrders is", colOrders);

          return (
            <div
              key={colId}
              className="bg-[#111113] border border-[#27272a] rounded-[14px] p-4 min-h-[300px]"
            >
              <ColumnHeader
                dotColor={meta.dotColor}
                title={meta.title}
                count={colOrders.length}
              />

              {colOrders.map(
                (order) => (
                  console.log("order is", order),
                  (
                    <TicketCard
                      key={order.id}
                      order={order}
                      onAdvanceItem={advanceItem}
                      onSetItemStatus={setItemStatus}
                    />
                  )
                ),
              )}
            </div>
          );
        })}

        {/* Served Column */}
        <div className="bg-[#111113] border border-[#27272a] rounded-[14px] p-4 flex flex-col">
          <div className="flex justify-between items-center mb-3.5">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.5px] text-[#d4d4d8]">
              <ChevronsRight size={15} color="#71717a" />
              SERVED
            </div>
            <span className="bg-[#27272a] text-[#d4d4d8] text-xs font-bold px-2 py-0.5 rounded">
              {served.length}
            </span>
          </div>

          <div className="flex-1">
            {served.slice(0, 4).map((ticket) => (
              <div
                key={`${ticket.id}-${ticket.meta}`}
                className="bg-[#18181b] border border-[#27272a] rounded-[10px] p-3.5 mb-3"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[17px] text-[#d4d4d8]">
                      #{ticket.id.slice(0, 6)}
                    </div>
                    <div className="text-[11.5px] text-[#71717a] mt-0.5 uppercase">
                      {ticket.meta}
                    </div>
                  </div>
                  <div className="w-5.5 h-5.5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check size={13} color="#4ade80" />
                  </div>
                </div>
                <div className="text-sm text-[#a1a1aa] mt-2">
                  {ticket.summary}
                </div>
              </div>
            ))}
          </div>

          <button className="bg-transparent border-0 border-t border-[#27272a] text-[#60a5fa] text-[13.5px] font-semibold py-3 px-0 cursor-pointer">
            View All History
          </button>
        </div>
      </div>
    </div>
  );
}
