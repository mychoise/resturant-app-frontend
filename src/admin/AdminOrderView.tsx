import React, { useState, useRef, useEffect } from "react";
import {
  ClipboardList,
  Flame,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { useGetAllOrdersAdmin, useGetOrderStats } from "../hooks/auth.hook";

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

const formatDate = (d) =>
  d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// yyyy-mm-dd in UTC, for sending to the API as the `date` query param.
// Adjust here if your backend expects local time or a different format.
const toApiDateString = (d) => {
  const year = d.getUTCFullYear();
  const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = d.getUTCDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (d) => {
  const date = new Date(d);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";
  const actualtime =
    year +
    "-" +
    month.toString().padStart(2, "0") +
    "-" +
    day.toString().padStart(2, "0") +
    " " +
    (hours % 12 || 12).toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    " " +
    ampm;

  return actualtime;
};

const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// Builds a compact page list with ellipses, e.g. 1 … 4 5 [6] 7 8 … 12
function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const withEllipses = [];
  sorted.forEach((page, idx) => {
    if (idx > 0 && page - sorted[idx - 1] > 1) {
      withEllipses.push("...");
    }
    withEllipses.push(page);
  });
  return withEllipses;
}

/* ---------- Calendar dropdown (single date select) ---------- */
function DatePicker({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(
    new Date(selected.getFullYear(), selected.getMonth(), 1),
  );
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstWeekday = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth(),
    1,
  ).getDay();
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1),
    ),
  ];

  const handlePick = (day) => {
    if (!day) return;
    onChange(day);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-300"
      >
        <Calendar size={16} />
        {formatDate(selected)}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() =>
                setViewMonth(
                  new Date(
                    viewMonth.getFullYear(),
                    viewMonth.getMonth() - 1,
                    1,
                  ),
                )
              }
              className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-sm font-semibold text-neutral-800">
              {viewMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              onClick={() =>
                setViewMonth(
                  new Date(
                    viewMonth.getFullYear(),
                    viewMonth.getMonth() + 1,
                    1,
                  ),
                )
              }
              className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] font-medium text-neutral-400 mb-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const isSelected = isSameDay(day, selected);
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => handlePick(day)}
                  className={`h-8 w-8 mx-auto flex items-center justify-center rounded-full text-xs transition-colors ${
                    isSelected
                      ? "bg-neutral-900 text-white font-semibold"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Table filter dropdown ---------- */
function TableSelect({ value, onChange, tables }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLabel =
    value === "all"
      ? "All Tables"
      : (tables.find((t) => t.id === value)?.label ?? "All Tables");

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-300"
      >
        {currentLabel}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg max-h-64 overflow-y-auto">
          <button
            type="button"
            onClick={() => {
              onChange("all");
              setOpen(false);
            }}
            className={`flex w-full items-center px-3 py-2 text-sm text-left hover:bg-neutral-50 ${
              value === "all"
                ? "text-neutral-900 font-semibold"
                : "text-neutral-600"
            }`}
          >
            All Tables
          </button>
          {tables.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => {
                onChange(t.id);
                setOpen(false);
              }}
              className={`flex w-full items-center px-3 py-2 text-sm text-left hover:bg-neutral-50 ${
                value === t.id
                  ? "text-neutral-900 font-semibold"
                  : "text-neutral-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const GRID_COLS = "grid-cols-[1fr_1.5fr_1fr_1fr_1fr_0.3fr]";

// Maps the visible tab label to whatever value the API's `status` param expects.
// "All Orders" -> undefined means "don't filter by status at all".
const TAB_TO_STATUS = {
  "All Orders": undefined,
  Pending: "pending",
  Preparing: "preparing",
  Ready: "ready",
  Served: "served",
};

export default function AdminOrderView() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [tableFilter, setTableFilter] = useState("all"); // "all" or a table_id
  const [selectedDate, setSelectedDate] = useState(new Date()); // default to today, not a fixed 2023 date
  const [page, setPage] = useState(1);

  const tabs = Object.keys(TAB_TO_STATUS);

  const {
    data,
    isLoading: statsLoading,
    isError: statsError,
  } = useGetOrderStats();

  const statusParam = TAB_TO_STATUS[activeTab];
  const dateParam = toApiDateString(selectedDate);
  const tableIdParam = tableFilter === "all" ? undefined : tableFilter;

  const {
    data: allOrder,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useGetAllOrdersAdmin(page, statusParam, dateParam, tableIdParam);

  console.log("all order is", allOrder);

  // Reset to page 1 whenever a filter changes, so we don't get stuck on
  // e.g. page 3 of a filter that now only has 1 page of results.
  useEffect(() => {
    setPage(1);
  }, [activeTab, tableFilter, selectedDate]);

  const orders = allOrder?.data ?? [];

  // Table dropdown options — built from whatever orders are currently loaded.
  // NOTE: this only shows tables present on the current page/filter, since
  // there's no separate "list all tables" endpoint wired up here. If you
  // have a tables list elsewhere, swap this out for that instead.
  const tableOptions = React.useMemo(() => {
    const map = new Map();
    orders.forEach((o) => {
      if (o.table_id != null && !map.has(o.table_id)) {
        map.set(o.table_id, o.table_number ?? `Table ${o.table_id}`);
      }
    });
    return [...map.entries()].map(([id, label]) => ({ id, label }));
  }, [orders]);

  // Pagination metadata from the API response — adjust field names to match
  // whatever getAllOrders() actually returns.
  const totalPages =
    allOrder?.totalPages ??
    allOrder?.total_pages ??
    allOrder?.meta?.totalPages ??
    5;
  const totalCount = allOrder?.total ?? allOrder?.meta?.total ?? orders.length;

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="min-h-screen w-full bg-[#FCF9F5] p-6">
      <h1 className="text-3xl ml-26 font-[font4] mb-10">Order Management</h1>
      <div className="mx-auto max-w-7xl">
        {/* Top stat cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1fr] mb-8">
          <div className="rounded-2xl border border-neutral-200 bg-[#F5F1E8] p-6">
            <h2 className="font-serif text-2xl text-neutral-900 mb-2">
              Morning Service Pulse
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              24 active orders currently in preparation. Average turn time is
              holding at 42 minutes.
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-amber-600">
                {data?.kithcenLoad}%
              </span>
              <span className="text-sm text-neutral-500">Kitchen Load</span>
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-6 flex flex-col justify-between">
            <ClipboardList className="text-amber-400" size={28} />
            <div>
              <p className="text-sm text-neutral-400 mb-1">Pending Cooking</p>
              <p className="text-4xl font-bold text-white">
                {data?.pendingCooking}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-400 p-6 flex flex-col justify-between">
            <Flame className="text-neutral-900" size={28} fill="currentColor" />
            <div>
              <p className="text-sm text-amber-900 mb-1">Served Today</p>
              <p className="text-4xl font-bold text-neutral-900">
                {data?.served}
              </p>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="relative z-10 flex items-center justify-between mb-6 flex-wrap gap-3">
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
            <DatePicker selected={selectedDate} onChange={setSelectedDate} />
            <TableSelect
              value={tableFilter}
              onChange={setTableFilter}
              tables={tableOptions}
            />
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
            {ordersLoading && (
              <div className="px-6 py-10 text-center text-sm text-neutral-400">
                Loading orders…
              </div>
            )}

            {ordersError && !ordersLoading && (
              <div className="px-6 py-10 text-center text-sm text-red-500">
                Couldn't load orders. Try again.
              </div>
            )}

            {!ordersLoading &&
              !ordersError &&
              orders.map((order, idx) => (
                <div
                  key={order.id}
                  className={`grid ${GRID_COLS} items-center px-6 py-4 hover:bg-neutral-50 ${
                    idx !== orders.length - 1
                      ? "border-b border-neutral-200"
                      : ""
                  }`}
                >
                  <div className="text-sm font-semibold text-neutral-900">
                    # {order.id.split("-")[1] + "-" + order.id.split("-")[2]}
                  </div>

                  <div className="text-sm text-neutral-800">
                    <span className="font-semibold text-neutral-900">
                      {order.table_number}
                    </span>
                  </div>

                  <div className="text-left text-sm font-bold text-neutral-900">
                    ${order.total_price}
                  </div>

                  <div>
                    <StatusBadge
                      status={
                        order.status[0].toUpperCase() + order.status.slice(1)
                      }
                    />
                  </div>

                  <div className="text-sm text-neutral-500">
                    {formatTime(order.updated_at)}
                  </div>

                  <div className="flex justify-end">
                    <button className="text-neutral-400 hover:text-neutral-700">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              ))}

            {!ordersLoading && !ordersError && orders.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-neutral-400">
                No orders match this filter.
              </div>
            )}
          </div>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-between px-6 py-4 flex-wrap gap-3">
            <div className="text-sm text-neutral-500">
              Showing {orders.length} of {totalCount} orders
              {totalPages > 1 && (
                <span className="ml-2 text-neutral-400">
                  (page {page} of {totalPages})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!canGoPrev}
                onClick={() => canGoPrev && setPage((p) => p - 1)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                  canGoPrev
                    ? "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                    : "border-neutral-200 text-neutral-300"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              {pageNumbers.map((item, idx) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="flex h-9 w-9 items-center justify-center text-sm text-neutral-400"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPage(item)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${
                      item === page
                        ? "bg-neutral-900 text-white"
                        : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                type="button"
                disabled={!canGoNext}
                onClick={() => canGoNext && setPage((p) => p + 1)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                  canGoNext
                    ? "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                    : "border-neutral-200 text-neutral-300"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
