import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useGetAllUsersAdmin } from "../hooks/auth.hook";

const TABS = ["ALL", "KITCHEN", "WAITER"];

// Map UI tab -> API category param. "ALL" means "no filter", so it's sent
// as undefined rather than the literal string "ALL".
const tabToCategory = (tab) => (tab === "ALL" ? undefined : tab);

const StatusBadge = ({ status }) => {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-[font2] font-semibold tracking-wide ${
        isActive
          ? "bg-amber-300 text-neutral-900"
          : "bg-neutral-200 text-neutral-600"
      }`}
    >
      {status}
    </span>
  );
};

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

export default function StaffDirectory() {
  const [tab, setTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: users, isLoading } = useGetAllUsersAdmin(
    currentPage,
    tabToCategory(tab)?.toLowerCase(),
  );

  const rows = users?.data ?? [];

  // Reset to page 1 whenever the tab/category filter changes, so the user
  // isn't stranded on e.g. page 4 of a filter that only has 1 page.
  useEffect(() => {
    setCurrentPage(1);
  }, [tab]);

  const totalPages =
    users?.totalPages ?? users?.total_pages ?? users?.meta?.totalPages ?? 1;
  const totalCount = users?.total ?? users?.meta?.total ?? rows.length ?? 0;

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const handleEdit = (person) => {
    // Wire this up to your edit modal / form
    console.log("Edit", person);
  };

  const handleDelete = (id) => {
    // NOTE: this only affects local state — it does not call a delete
    // mutation, so the row will reappear after the query refetches.
    // Wire this to a real delete mutation (e.g. useDeleteUserAdmin) and
    // invalidate the "all-users-admin" query key on success.
    console.log("Delete", id);
  };

  const rangeStart =
    rows.length === 0 ? 0 : (currentPage - 1) * rows.length + 1;
  const rangeEnd = rows.length === 0 ? 0 : rangeStart + rows.length - 1;

  return (
    <div className=" w-full flex items-center mt-10  justify-center">
      <div className="w-full border border-[#C8C7BF]  rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-6">
            <h1 className="font-serif text-2xl text-neutral-900">
              Staff Directory
            </h1>
            <div className="flex items-center gap-2">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
                    tab === t
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
            <SlidersHorizontal size={16} />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="w-full">
          {/* Table head */}
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_0.7fr] bg-[#EFEAE0] px-8 py-3 text-[11px] font-semibold tracking-widest text-neutral-500">
            <div>NAME &amp; IDENTITY</div>
            <div>ROLE</div>
            <div>STATUS</div>
            <div>DATE JOINED</div>
            <div className="text-right">ACTIONS</div>
          </div>

          {/* Table rows */}
          <div>
            {isLoading && (
              <div className="px-8 py-10 text-center text-sm text-neutral-400">
                Loading staff…
              </div>
            )}

            {!isLoading &&
              rows.map((person, idx) => (
                <div
                  key={person.id}
                  className={`group grid grid-cols-[2fr_1.5fr_1fr_1fr_0.7fr] items-center px-8 py-5 transition-colors hover:bg-neutral-50 ${
                    idx !== rows.length - 1 ? "border-b border-neutral-200" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 bg-neutral-800 text-white w-10 items-center justify-center rounded-full text-sm font-semibold `}
                    >
                      {person?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="text-[16px] font-[font2] font-semibold text-neutral-900">
                        {person.name}
                      </div>
                      <div className="text-sm text-neutral-400">
                        {person.email}
                      </div>
                    </div>
                  </div>

                  <div className="text-[16px] font-[font2] font-semibold text-neutral-800">
                    {person.role}
                  </div>

                  <div>
                    <StatusBadge
                      status={person.is_active ? "Active" : "On Leave"}
                    />
                  </div>

                  <div className="text-[15px] font-[font2] text-neutral-500">
                    {person.created_at
                      ? new Date(person.created_at).toLocaleDateString()
                      : ""}
                  </div>

                  {/* Actions: hidden until row hover, then fade/slide in */}
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleEdit(person)}
                      aria-label={`Edit ${person.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-neutral-400 opacity-0 translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 hover:border-neutral-300 hover:bg-white hover:text-neutral-700"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(person.id)}
                      aria-label={`Delete ${person.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-neutral-400 opacity-0 translate-x-1 transition-all duration-150 delay-[30ms] group-hover:opacity-100 group-hover:translate-x-0 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}

            {!isLoading && rows.length === 0 && (
              <div className="px-8 py-10 text-center text-sm text-neutral-400">
                No staff members found.
              </div>
            )}
          </div>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-between bg-[#EFEAE0] px-8 py-4">
            <div className="text-sm text-neutral-500">
              Showing {rangeStart} to {rangeEnd} of {totalCount} staff members
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!canGoPrev}
                onClick={() => canGoPrev && setCurrentPage((p) => p - 1)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                  canGoPrev
                    ? "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50"
                    : "border-neutral-200 bg-white text-neutral-300"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

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

              <button
                type="button"
                disabled={!canGoNext}
                onClick={() => canGoNext && setCurrentPage((p) => p + 1)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                  canGoNext
                    ? "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50"
                    : "border-neutral-200 bg-white text-neutral-300"
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
