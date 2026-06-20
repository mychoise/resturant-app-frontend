import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("waiter");

  const handleSubmit = () => {
    const payload = { name, email, password, role };
    console.log(payload);
    // wire this up to your API call, e.g.
    // fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#EEEFEB] px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Crest / Monogram */}
        <div className="w-20 h-20 rounded-full border border-[#1a1a1a] flex items-center justify-center mb-6 bg-[#ece9e2]">
          <span className="font-serif text-2xl tracking-wide text-[#1a1a1a]">
            TBP
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl text-[#1a1a1a] text-center mb-2">
          The Heritage Ledger
        </h1>
        <p className="text-xs tracking-[0.2em] text-[#6b6b6b] font-medium mb-8">
          STAFF REGISTRATION
        </p>

        {/* Card */}
        <div className="w-full bg-white shadow-sm px-10 py-10">
          {/* Quote */}
          <p className="font-serif italic text-center text-[#3a3a3a] text-lg leading-relaxed mb-8">
            "Honoring the past through impeccable service."
          </p>

          {/* Name */}
          <div className="mb-6">
            <label className="block text-xs font-semibold font-[font2] tracking-widest text-[#b8863b] mb-3">
              FULL NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Full Name"
              className="w-full border-b-2 font-[font2] tracking-wider border-[#d4d4d4] pb-2 text-sm text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:border-[#1a1a1a] bg-transparent transition-colors"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-xs font-semibold font-[font2] tracking-widest text-[#b8863b] mb-3">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
              className="w-full border-b-2 font-[font2] tracking-wider border-[#d4d4d4] pb-2 text-sm text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:border-[#1a1a1a] bg-transparent transition-colors"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-xs font-semibold font-[font2] tracking-widest text-[#b8863b] mb-3">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border-b border-[#d4d4d4] font-[font2] tracking-wider pb-2 text-sm text-[#1a1a1a] placeholder-[#c4c4c4] focus:outline-none focus:border-[#1a1a1a] bg-transparent transition-colors"
            />
          </div>

          {/* Role */}
          <div className="mb-10">
            <label className="block text-xs font-semibold font-[font2] tracking-widest text-[#b8863b] mb-3">
              ROLE
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("waiter")}
                className={`py-3 text-xs font-semibold font-[font2] tracking-widest border transition-colors ${
                  role === "waiter"
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                    : "bg-transparent text-[#3a3a3a] border-[#d4d4d4] hover:border-[#1a1a1a]"
                }`}
              >
                WAITER
              </button>
              <button
                type="button"
                onClick={() => setRole("kitchen")}
                className={`py-3 text-xs font-semibold font-[font2] tracking-widest border transition-colors ${
                  role === "kitchen"
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                    : "bg-transparent text-[#3a3a3a] border-[#d4d4d4] hover:border-[#1a1a1a]"
                }`}
              >
                KITCHEN
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-[#1a1a1a] font-[font2] tracking-widest hover:bg-[#2a2a2a] transition-colors text-white text-xs font-semibold py-4 flex items-center justify-center gap-2 mb-6"
          >
            JOIN THE LEDGER
            <Pencil size={13} strokeWidth={2} />
          </button>

          <hr className="border-t border-[#e5e5e5] mb-6" />

          {/* Already registered */}
          <div className="text-center">
            <span className="text-xs tracking-widest text-[#6b6b6b] font-medium">
              ALREADY ON STAFF?{" "}
            </span>
            <Link
              to={"/login"}
              className="text-xs tracking-widest text-[#1a1a1a] font-semibold underline underline-offset-4"
            >
              SIGN IN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
