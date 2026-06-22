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
  return `Table ${order.table_number ?? order.table_id}`;
}

function normalizeOrderPayload(payload: any): Order | null {
  const raw = payload?.order ?? payload;
  if (!raw || !raw.id) return null;

  return {
    id: raw.id,
    table_id: raw.table_id,
    table_number: raw.table_number,
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        marginBottom: 8,
        background: "rgba(255,255,255,0.03)",
        padding: "8px 10px",
        borderRadius: 8,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "#d4d4d8",
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: 4,
            minWidth: 22,
            textAlign: "center",
          }}
        >
          {item.quantity}x
        </span>
        <span style={{ fontSize: 14, color: "#e4e4e7" }}>{item.item_name}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {buttonLabel && (
          <button
            onClick={() => onAdvance(item.id, item.status)}
            style={{
              background:
                item.status === "pending"
                  ? "#3b82f6"
                  : item.status === "preparing"
                    ? "#f59e0b"
                    : "rgba(34,197,94,0.25)",
              color:
                item.status === "ready"
                  ? "#86efac"
                  : item.status === "preparing"
                    ? "#1c1917"
                    : "white",
              border:
                item.status === "ready"
                  ? "1px solid rgba(34,197,94,0.4)"
                  : "none",
              borderRadius: 7,
              padding: "5px 12px",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            {item.status === "ready" && <Check size={13} />}
            {buttonLabel}
          </button>
        )}

        {item.status === "served" && (
          <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 600 }}>
            <Check size={13} style={{ marginRight: 4 }} />
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
    <div
      style={{
        background: "#18181b",
        border: "1px solid #27272a",
        borderRadius: 10,
        marginBottom: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "14px 14px 10px 14px",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 19, color: "#93c5fd" }}>
            #{order.id.slice(0, 6)}
          </div>
          <div style={{ fontSize: 12.5, color: "#a1a1aa", marginTop: 2 }}>
            {getOrderMeta(order)}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 14px 14px 14px" }}>
        {order.items.length === 0 ? (
          <div style={{ fontSize: 12.5, color: "#71717a" }}>No items</div>
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
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          display: "inline-block",
        }}
      />
      <span style={{ color: "#a1a1aa" }}>{label}</span>
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
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 0.5,
          color: "#d4d4d8",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: dotColor,
            display: "inline-block",
          }}
        />
        {title.toUpperCase()}
      </div>
      <span
        style={{
          background: "#27272a",
          color: "#d4d4d8",
          fontSize: 12,
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: 6,
        }}
      >
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

    socket.on("order:alert", (payload: any) => {
      playOrderSound();

      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} w-[340px] rounded-[14px] overflow-hidden border border-[#2a2825] shadow-2xl`}
            style={{ background: "#1c1917" }}
          >
            {/* Header bar */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ background: "#78350f" }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-widest">
                  Kitchen Alert
                </span>
              </div>
              <span className="text-[11px] font-[font2] text-amber-300 bg-[#92400e] px-2.5 py-0.5 rounded-full font-medium">
                Table {payload.tableNumber}
              </span>
            </div>

            {/* Body */}
            <div className="flex gap-3 items-start px-4 py-3.5">
              <div className="flex-shrink-0 w-10 h-10 rounded-[10px] bg-[#292524] border border-[#3a3532] flex items-center justify-center">
                <span className="text-amber-400 text-lg">🍽</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-[font4] font-semibold text-white mb-1">
                  Order pending
                </p>
                <p className="text-[13px] font-[font2] text-[#a8a29e] leading-snug">
                  {payload.msg}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#2a2825] px-4 py-2.5 flex items-center justify-between">
              <span className="text-[12px] text-[#57534e]">Just now</span>
              <div className="flex gap-2">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="text-[12px] text-[#a8a29e] bg-[#292524] border border-[#3a3532] px-3 py-1 rounded-lg"
                >
                  Dismiss
                </button>
                {/*<button
                  onClick={() => toast.dismiss(t.id)}
                  className="text-[12px] text-[#1c1917] bg-amber-400 px-3 py-1 rounded-lg font-semibold"
                >
                  Mark done
                </button>*/}
              </div>
            </div>
          </div>
        ),
        { duration: 6000, position: "top-right" },
      );
      console.log("payload is", payload);
      // alert("hi");
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

  function getOrderColumn(order: Order): "pending" | "preparing" | "ready" {
    console.log("items are ", order);
    const items = order.items ?? [];
    if (items.length === 0) return "pending";
    const statuses = items.map((i) => i.status);
    if (statuses.some((s) => s === "pending")) return "pending";
    if (statuses.some((s) => s === "preparing")) return "preparing";
    return "ready";
  }

  const columnBuckets: Record<string, Order[]> = {
    pending: [],
    preparing: [],
    ready: [],
  };

  Object.values(orders)
    .sort(
      (a, b) =>
        new Date(b.ordered_at ?? 0).getTime() -
        new Date(a.ordered_at ?? 0).getTime(),
    )
    .forEach((order) => {
      const col = getOrderColumn(order);
      columnBuckets[col].push(order);
    });

  const order_columns_priority = ["pending", "preparing", "ready"];
  const totalActive = Object.values(orders).length;

  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        padding: "32px 28px",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            Workflow Board
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: 14, marginTop: 6 }}>
            {totalActive} active tickets across all stations.
          </p>
        </div>

        <div style={{ display: "flex", gap: 18, fontSize: 13.5 }}>
          <Legend color="#9ca3af" label="Pending" />
          <Legend color="#fb923c" label="Preparing" />
          <Legend color="#4ade80" label="Ready" />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(240px, 1fr))",
          gap: 18,
        }}
      >
        {order_columns_priority.map((colId) => {
          const meta = COLUMN_META[colId];
          const colOrders = columnBuckets[colId];

          return (
            <div
              key={colId}
              style={{
                background: "#111113",
                border: "1px solid #27272a",
                borderRadius: 14,
                padding: 16,
                minHeight: 300,
              }}
            >
              <ColumnHeader
                dotColor={meta.dotColor}
                title={meta.title}
                count={colOrders.length}
              />

              {colOrders.map((order) => (
                <TicketCard
                  key={order.id}
                  order={order}
                  onAdvanceItem={advanceItem}
                  onSetItemStatus={setItemStatus}
                />
              ))}
            </div>
          );
        })}

        <div
          style={{
            background: "#111113",
            border: "1px solid #27272a",
            borderRadius: 14,
            padding: 16,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: "#d4d4d8",
              }}
            >
              <ChevronsRight size={15} color="#71717a" />
              SERVED
            </div>
            <span
              style={{
                background: "#27272a",
                color: "#d4d4d8",
                fontSize: 12,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 6,
              }}
            >
              {served.length}
            </span>
          </div>

          <div style={{ flex: 1 }}>
            {served.slice(0, 4).map((ticket) => (
              <div
                key={`${ticket.id}-${ticket.meta}`}
                style={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 17,
                        color: "#d4d4d8",
                      }}
                    >
                      #{ticket.id.slice(0, 6)}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: "#71717a",
                        marginTop: 2,
                        textTransform: "uppercase",
                      }}
                    >
                      {ticket.meta}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "rgba(34,197,94,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={13} color="#4ade80" />
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "#a1a1aa", marginTop: 8 }}>
                  {ticket.summary}
                </div>
              </div>
            ))}
          </div>

          <button
            style={{
              background: "transparent",
              border: "none",
              borderTop: "1px solid #27272a",
              color: "#60a5fa",
              fontSize: 13.5,
              fontWeight: 600,
              padding: "12px 0 2px 0",
              cursor: "pointer",
            }}
          >
            View All History
          </button>
        </div>
      </div>
    </div>
  );
}
