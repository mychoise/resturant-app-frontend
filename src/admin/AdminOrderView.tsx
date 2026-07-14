import React, { useState } from "react";
import {
  ClipboardList,
  Flame,
  Calendar,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

const orders = [
  {
    id: "#EL-8942",
    table: "Table 12",
    tableNote: "(Patio)",
    total: "$342.50",
    status: "Preparing",
    time: "12:45 PM",
  },
  {
    id: "#EL-8943",
    table: "Table 04",
    tableNote: "(Booth)",
    total: "$118.00",
    status: "Pending",
    time: "12:52 PM",
  },
  {
    id: "#EL-8941",
    table: "Table 22",
    tableNote: "(Window)",
    total: "$520.25",
    status: "Ready",
    time: "12:30 PM",
  },
  {
    id: "#EL-8940",
    table: "Bar 02",
    tableNote: "",
    total: "$45.00",
    status: "Served",
    time: "12:15 PM",
  },
  {
    id: "#EL-8939",
    table: "Table 09",
    tableNote: "(Main Hall)",
    total: "$210.00",
    status: "Served",
    time: "11:58 AM",
  },
];

const statusStyles = {
  Preparing: "bg-amber-300 text-amber-900",
  Pending: "bg-neutral-200 text-neutral-600",
  Ready: "bg-emerald-100 text-emerald-700",
  Served: "bg-blue-100 text-blue-700",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
  >
    {status}
  </span>
);

// Single source of truth for the grid so header and body can never drift apart.
const GRID_COLS = "grid-cols-[1fr_1.5fr_1fr_1fr_1fr_0.3fr]";

export default function AdminOrderView() {
  const [activeTab, setActiveTab] = useState("Preparing");
  const tabs = ["All Orders", "Pending", "Preparing", "Ready", "Served"];

  return (
    <div className="min-h-screen w-full bg-[#FCF9F5] p-6">
      <h1 className="text-3xl ml-26 font-[font4] mb-10">Order Management</h1>
      <div className="mx-auto max-w-7xl">
        {/* Top stat cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1fr] mb-8">
          {/* Morning Service Pulse */}
          <div className="rounded-2xl border border-neutral-200 bg-[#F5F1E8] p-6">
            <h2 className="font-serif text-2xl text-neutral-900 mb-2">
              Morning Service Pulse
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              24 active orders currently in preparation. Average turn time is
              holding at 42 minutes.
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-amber-600">88%</span>
              <span className="text-sm text-neutral-500">
                Kitchen Efficiency
              </span>
            </div>
          </div>

          {/* Pending Approval */}
          <div className="rounded-2xl bg-neutral-900 p-6 flex flex-col justify-between">
            <ClipboardList className="text-amber-400" size={28} />
            <div>
              <p className="text-sm text-neutral-400 mb-1">Pending Cooking</p>
              <p className="text-4xl font-bold text-white">12</p>
            </div>
          </div>

          {/* High Priority */}
          <div className="rounded-2xl bg-amber-400 p-6 flex flex-col justify-between">
            <Flame className="text-neutral-900" size={28} fill="currentColor" />
            <div>
              <p className="text-sm text-amber-900 mb-1">Served Today</p>
              <p className="text-4xl font-bold text-neutral-900">04</p>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
                  activeTab === tab
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-transparent text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-300">
              <Calendar size={16} />
              Oct 24, 2023 - Today
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-300">
              <SlidersHorizontal size={16} />
              More Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-neutral-200 bg-[#FBF9F4] overflow-hidden">
          <div
            className={`grid ${GRID_COLS} bg-[#EFEAE0] px-6 py-3 text-[11px] font-semibold tracking-widest text-neutral-500`}
          >
            <div>ORDER ID</div>
            <div>TABLE</div>
            <div className="text-left">TOTAL</div>
            <div>STATUS</div>
            <div>TIME</div>
            <div></div>
          </div>

          <div>
            {orders.map((order, idx) => (
              <div
                key={order.id}
                className={`grid ${GRID_COLS} items-center px-6 py-4 hover:bg-neutral-50 ${
                  idx !== orders.length - 1 ? "border-b border-neutral-200" : ""
                }`}
              >
                <div className="text-sm font-semibold text-neutral-900">
                  {order.id}
                </div>

                <div className="text-sm text-neutral-800">
                  {order.table}{" "}
                  {order.tableNote && (
                    <span className="text-neutral-400">{order.tableNote}</span>
                  )}
                </div>

                <div className="text-left text-sm font-bold text-neutral-900">
                  {order.total}
                </div>

                <div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="text-sm text-neutral-500">{order.time}</div>

                <div className="flex justify-end">
                  <button className="text-neutral-400 hover:text-neutral-700">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-sm text-neutral-500">
              Showing 5 of 124 orders
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-300"
              >
                <ChevronLeft size={16} />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
