import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useGetAllUsersAdmin } from "../hooks/auth.hook";

const initialStaff = [
  {
    id: 1,
    initials: "JD",
    avatarBg: "bg-neutral-800",
    avatarText: "text-white",
    name: "Julian De Silva",
    email: "julian.d@elite.res",
    role: "Executive Chef",
    status: "Active",
    date: "Oct 12, 2022",
  },
  {
    id: 2,
    initials: "MW",
    avatarBg: "bg-amber-300",
    avatarText: "text-neutral-900",
    name: "Margot Weaver",
    email: "m.weaver@elite.res",
    role: "Sommelier",
    status: "On Leave",
    date: "Jan 05, 2023",
  },
  {
    id: 3,
    initials: "AL",
    avatarBg: "bg-neutral-200",
    avatarText: "text-neutral-800",
    name: "Andre Laurent",
    email: "andre.l@elite.res",
    role: "Maître D'",
    status: "Active",
    date: "Mar 19, 2021",
  },
  {
    id: 4,
    initials: "SM",
    avatarBg: "bg-neutral-800",
    avatarText: "text-white",
    name: "Sienna Moretti",
    email: "sienna.m@elite.res",
    role: "Sous Chef",
    status: "Active",
    date: "Jun 22, 2023",
  },
];

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

export default function StaffDirectory() {
  const [tab, setTab] = useState("ALL");
  const [staff, setStaff] = useState(initialStaff);
  const tabs = ["ALL", "KITCHEN", "FLOOR"];
  const [currentPage, setCurrentPage] = useState(1);

  const { data: users } = useGetAllUsersAdmin(currentPage);
  console.log("users is", users);

  const handleEdit = (person) => {
    // Wire this up to your edit modal / form
    console.log("Edit", person);
  };

  const handleDelete = (id) => {
    setStaff((prev) => prev.filter((p) => p.id !== id));
  };

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
              {tabs.map((t) => (
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
            {users?.data?.map((person, idx) => (
              <div
                key={person.id}
                className={`group grid grid-cols-[2fr_1.5fr_1fr_1fr_0.7fr] items-center px-8 py-5 transition-colors hover:bg-neutral-50 ${
                  idx !== staff.length - 1 ? "border-b border-neutral-200" : ""
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

            {staff.length === 0 && (
              <div className="px-8 py-10 text-center text-sm text-neutral-400">
                No staff members left.
              </div>
            )}
          </div>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-between bg-[#EFEAE0] px-8 py-4">
            <div className="text-sm text-neutral-500">
              Showing {staff.length} to {staff.length} of 42 staff members
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-400 hover:bg-neutral-50">
                <ChevronLeft size={16} />
              </button>

              {[1, 2, 3].map((item) => (
                <button
                  onClick={() => {
                    setCurrentPage(item);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-sm font-semibold text-white"
                >
                  {item}
                </button>
              ))}

              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
