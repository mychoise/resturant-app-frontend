import { useState } from "react";
import { Check, ChevronsRight } from "lucide-react";

type TicketItem = {
  qty: string;
  name: string;
};

type Ticket = {
  id: string;
  meta: string;
  items: TicketItem[];
  rush: boolean;
  note?: string;
};

type Column = {
  id: string;
  title: string;
  dotColor: string;
  tickets: Ticket[];
};

type ServedTicket = {
  id: string;
  meta: string;
  summary: string;
};

const initialColumns: Record<string, Column> = {
  pending: {
    id: "pending",
    title: "Pending",
    dotColor: "#9ca3af",
    tickets: [
      {
        id: "1045",
        meta: "Table 04 • 02:30 min",
        items: [{ qty: "1x", name: "Margherita Pizza" }],
        rush: false,
      },
      {
        id: "1046",
        meta: "Table 02 • 00:45 min",
        items: [{ qty: "2x", name: "Caesar Salad" }],
        rush: false,
      },
    ],
  },
  preparing: {
    id: "preparing",
    title: "Preparing",
    dotColor: "#fb923c",
    tickets: [
      {
        id: "1044",
        meta: "Table 08 • 08:12 min",
        items: [
          { qty: "1x", name: "Spicy Rigatoni" },
          { qty: "1x", name: "Garlic Bread" },
        ],
        rush: false,
      },
      {
        id: "1042",
        meta: "Table 12 • 15:42 min (RUSH)",
        items: [{ qty: "2x", name: "Truffle Burger" }],
        rush: true,
        note: "No Onions, Medium Rare",
      },
    ],
  },
  ready: {
    id: "ready",
    title: "Ready",
    dotColor: "#4ade80",
    tickets: [
      {
        id: "1039",
        meta: "Delivery • UberEats",
        items: [
          { qty: "3x", name: "Classic Hot Dog" },
          { qty: "2x", name: "Large Fries" },
        ],
        rush: false,
      },
    ],
  },
};

const servedTickets: ServedTicket[] = [
  {
    id: "1038",
    meta: "Table 02 • Served 5m ago",
    summary: "1x Caesar Salad, 1x Iced Tea",
  },
  {
    id: "1037",
    meta: "Table 01 • Served 12m ago",
    summary: "2x Margherita Pizza, 1x Coke",
  },
];

function TicketCard({
  ticket,
  columnId,
  onAdvance,
}: {
  ticket: Ticket;
  columnId: string;
  onAdvance: (ticketId: string) => void;
}) {
  const isPending = columnId === "pending";
  const isPreparing = columnId === "preparing";
  const isReady = columnId === "ready";

  const borderColor = ticket.rush
    ? "#7f1d1d"
    : isPreparing
      ? "#7c4a23"
      : isReady
        ? "#14532d"
        : "#27272a";

  const bgColor = ticket.rush
    ? "rgba(127,29,29,0.25)"
    : isPreparing
      ? "rgba(124,74,35,0.2)"
      : isReady
        ? "rgba(20,83,45,0.25)"
        : "#18181b";

  return (
    <div
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderLeft: ticket.rush
          ? "3px solid #ef4444"
          : isPreparing
            ? "3px solid #f59e0b"
            : isReady
              ? "3px solid #22c55e"
              : `1px solid ${borderColor}`,
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
          <div
            style={{
              fontWeight: 700,
              fontSize: 19,
              color: ticket.rush
                ? "#fca5a5"
                : isPreparing
                  ? "#fdba74"
                  : isReady
                    ? "#86efac"
                    : "#93c5fd",
            }}
          >
            #{ticket.id}
          </div>
          <div style={{ fontSize: 12.5, color: "#a1a1aa", marginTop: 2 }}>
            {ticket.meta}
          </div>
        </div>

        {isPending && (
          <button
            onClick={() => onAdvance(ticket.id)}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 7,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Start
          </button>
        )}

        {isPreparing && (
          <button
            onClick={() => onAdvance(ticket.id)}
            style={{
              background: ticket.rush ? "#ef4444" : "#f59e0b",
              color: ticket.rush ? "white" : "#1c1917",
              border: "none",
              borderRadius: 7,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Ready
          </button>
        )}

        {isReady && (
          <button
            onClick={() => onAdvance(ticket.id)}
            style={{
              background: "rgba(34,197,94,0.25)",
              color: "#86efac",
              border: "1px solid rgba(34,197,94,0.4)",
              borderRadius: 7,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Check size={14} /> Serve
          </button>
        )}
      </div>

      <div style={{ padding: "0 14px 14px 14px" }}>
        {ticket.items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
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
              {item.qty}
            </span>
            <span style={{ fontSize: 14, color: "#e4e4e7" }}>{item.name}</span>
          </div>
        ))}

        {ticket.note && (
          <div
            style={{
              background: "#dc2626",
              color: "white",
              fontSize: 12.5,
              fontWeight: 600,
              fontStyle: "italic",
              padding: "6px 10px",
              borderRadius: 6,
              marginTop: 6,
            }}
          >
            - {ticket.note}
          </div>
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
  const [columns, setColumns] = useState(initialColumns);
  const [served, setServed] = useState(servedTickets);
  const order = ["pending", "preparing", "ready"];

  const advance = (ticketId: string) => {
    setColumns((prev) => {
      const next: Record<string, Column> = JSON.parse(JSON.stringify(prev));
      let sourceCol: string | null = null;
      let ticket: Ticket | null = null;

      for (const colId of order) {
        const idx = next[colId].tickets.findIndex((t) => t.id === ticketId);
        if (idx !== -1) {
          sourceCol = colId;
          ticket = next[colId].tickets[idx];
          next[colId].tickets.splice(idx, 1);
          break;
        }
      }

      if (!ticket || !sourceCol) return prev;

      const nextIdx = order.indexOf(sourceCol) + 1;
      if (nextIdx < order.length) {
        next[order[nextIdx]].tickets.unshift(ticket);
      } else {
        setServed((current) => [
          {
            id: ticket.id,
            meta: `${ticket.meta.split("•")[0].trim()} • Served just now`,
            summary: ticket.items.map((item) => `${item.qty} ${item.name}`).join(", "),
          },
          ...current,
        ]);
      }

      return next;
    });
  };

  const totalActive = order.reduce(
    (sum, id) => sum + columns[id].tickets.length,
    0,
  );

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
        {order.map((colId) => {
          const col = columns[colId];

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
                dotColor={col.dotColor}
                title={col.title}
                count={col.tickets.length}
              />

              {col.tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  columnId={colId}
                  onAdvance={advance}
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
                      style={{ fontWeight: 700, fontSize: 17, color: "#d4d4d8" }}
                    >
                      #{ticket.id}
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
