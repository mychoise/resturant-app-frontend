import React, { useState, useRef, useEffect } from "react";
import {
  Wallet,
  QrCode,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  MoreVertical,
} from "lucide-react";
import { useGetAllPaymentsAdmin, useGetPaymentStats } from "../hooks/auth.hook";

const PAYMENT_OPTIONS = [
  { label: "All Types", value: "all" },
  { label: "Cash", value: "cash" },
  { label: "Online", value: "online" },
];

const PaymentIcon = ({ category }) => (
  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
    {category === "cash" ? <Wallet size={16} /> : <QrCode size={16} />}
  </div>
);

const formatDate = (d) =>
  d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// Formats a Date into "YYYY-MM-DD" (UTC) — used both for display-independent
// comparisons and as the query param sent to the API.
const toISODateString = (d) => {
  const year = d.getUTCFullYear();
  const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = d.getUTCDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateTime = (d) => {
  const date = new Date(d);

  const year = date.getUTCFullYear(); // 2026
  const month = date.getUTCMonth() + 1; // 5 (months are zero-indexed)
  const day = date.getUTCDate(); // 15
  const hours = date.getUTCHours(); // 16
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
      <label className="block text-sm text-neutral-600 mb-1.5">Date</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 min-w-[220px] bg-white hover:border-neutral-400"
      >
        <Calendar size={16} className="text-neutral-400" />
        <span className="text-sm text-neutral-700">{formatDate(selected)}</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-72 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg">
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

          {/* Lets the user clear the date filter without hunting for "today" */}
          <div className="mt-3 pt-3 border-t border-neutral-100 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-800"
            >
              Clear date
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Payment type dropdown ---------- */
function PaymentTypeSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = PAYMENT_OPTIONS.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm text-neutral-600 mb-1.5">
        Payment Type
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-2 rounded-lg border border-neutral-300 px-3 py-2 min-w-[150px] bg-white hover:border-neutral-400"
      >
        <span className="text-sm text-neutral-700">{current.label}</span>
        <ChevronDown
          size={16}
          className={`text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full min-w-[150px] rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
          {PAYMENT_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm text-left hover:bg-neutral-50 ${
                opt.value === value
                  ? "text-neutral-900 font-semibold"
                  : "text-neutral-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Page ---------- */
export default function AdminViewPayment() {
  // null = no date filter applied (shows all dates)
  const [selectedDate, setSelectedDate] = useState(null);
  const [paymentType, setPaymentType] = useState("all");
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { data } = useGetPaymentStats();

  // Only send real filter values to the API — "all" and null should not be
  // sent as query params, since the hook/API treats their absence as "no filter".
  const apiPaymentType = paymentType === "all" ? undefined : paymentType;
  const apiDate = selectedDate ? toISODateString(selectedDate) : undefined;

  const { data: payments, isLoading: paymentsLoading } = useGetAllPaymentsAdmin(
    currentPage,
    apiPaymentType,
    apiDate,
  );

  // Reset back to page 1 whenever a filter changes, so the user isn't
  // stranded on e.g. page 4 of a filter that only has 1 page of results.
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, paymentType]);

  // The API now does the filtering (paymentType + date are sent as query
  // params), so we just render what comes back for the current page.
  const rows = payments?.data ?? [];

  // Pagination metadata — falls back gracefully if the API response
  // doesn't include explicit page-count info under one of these keys.
  const totalPages =
    payments?.totalPages ??
    payments?.total_pages ??
    payments?.meta?.totalPages ??
    5;
  const totalCount =
    payments?.total ?? payments?.meta?.total ?? rows.length ?? 0;

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

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

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="min-h-screen w-full bg-[#FBF9F4] p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className=" font-[font4] text-5xl text-neutral-900 mb-3">
              Financial Ledger
            </h1>
            <p className="text-neutral-500 max-w-md">
              A comprehensive historical record of all restaurant transactions,
              curated for absolute fiscal clarity.
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.6fr_1fr_1fr] mb-6">
          <div className="rounded-2xl border border-neutral-200 bg-[#EFEAE0] p-6">
            <p className="text-xs font-semibold tracking-widest text-neutral-500 mb-3">
              TOTAL REVENUE (MTD)
            </p>
            <p className="text-4xl font-bold text-neutral-900 mb-4">
              ${data?.totalRevenue || "0.00"}
            </p>
            <div className="flex items-center gap-1.5 text-sm font-medium text-amber-700">
              <h1>Total Payments:</h1>
              <span>{data?.totalPayment}</span>{" "}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col justify-between">
            <div className="text-amber-600 mb-8">
              <Wallet size={22} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">Cash On Hand</p>
              <p className="text-2xl font-bold text-neutral-900">
                ${data?.totalCash}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col justify-between">
            <div className="text-amber-600 mb-8">
              <QrCode size={22} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">eSewa Digital</p>
              <p className="text-2xl font-bold text-neutral-900">
                ${data?.totalOnline}
              </p>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="relative z-10 rounded-2xl border border-neutral-200 bg-white px-6 py-4 mb-6 flex items-end justify-between flex-wrap gap-4">
          <div className="flex items-end gap-4 flex-wrap">
            <DatePicker
              selected={selectedDate ?? new Date()}
              onChange={setSelectedDate}
            />
            <PaymentTypeSelect value={paymentType} onChange={setPaymentType} />

            {(selectedDate || paymentType !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(null);
                  setPaymentType("all");
                }}
                className="text-sm font-medium text-neutral-500 hover:text-neutral-800 pb-2"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50">
              <Download size={16} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50">
              <Printer size={16} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <div className="grid grid-cols-[1.2fr_1.3fr_1.3fr_1fr_0.3fr] bg-[#EFEAE0] px-6 py-3 text-sm font-semibold text-neutral-600">
            <div>Transaction ID</div>
            <div>Date &amp; Time</div>
            <div>Payment Type</div>
            <div className="text-right">Amount</div>
            <div></div>
          </div>

          <div>
            {paymentsLoading && (
              <div className="px-6 py-10 text-center text-sm text-neutral-400">
                Loading transactions…
              </div>
            )}

            {!paymentsLoading &&
              rows.map((txn, idx) => (
                <div
                  key={txn.id}
                  className={`grid grid-cols-[1.2fr_1.3fr_1.3fr_1fr_0.3fr] items-center px-6 py-4 hover:bg-neutral-50 ${
                    idx !== rows.length - 1 ? "border-b border-neutral-200" : ""
                  }`}
                >
                  <div className="text-sm font-semibold text-neutral-900">
                    #{txn?.id.split("-")[1] + "-" + txn?.id.split("-")[2]}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {formatDateTime(txn?.created_at)}
                  </div>
                  <div className="flex items-center gap-3">
                    <PaymentIcon category={txn.payment_type} />
                    <span className="text-sm text-neutral-800">
                      {txn?.payment_type.charAt(0).toUpperCase() +
                        txn?.payment_type.slice(1)}
                    </span>
                  </div>
                  <div className="text-right text-sm font-bold text-neutral-900">
                    ${txn?.total_price}
                  </div>
                  <div className="flex justify-end">
                    <button className="text-neutral-400 hover:text-neutral-700">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              ))}

            {!paymentsLoading && rows.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-neutral-400">
                No transactions match this filter.
              </div>
            )}
          </div>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200">
            <div className="text-sm text-neutral-500">
              Showing {rows.length} of {totalCount} transactions
              {totalPages > 1 && (
                <span className="ml-2 text-neutral-400">
                  (page {page} of {totalPages})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {pageNumbers.map((item, idx) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="flex h-8 w-8 items-center justify-center text-sm text-neutral-400"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCurrentPage(item)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold ${
                      item === currentPage
                        ? "bg-neutral-900 text-white"
                        : "border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
