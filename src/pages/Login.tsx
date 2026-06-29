import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { useLogin } from "../hooks/auth.hook";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [cipher, setCipher] = useState("");

  const { mutate } = useLogin();

  const hadleSubmit = () => {
    const payload = { email, password: cipher };
    console.log(payload);
    mutate(payload);
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
          PRIVATE STAFF ACCESS
        </p>

        {/* Card */}
        <div className="w-full bg-white shadow-sm px-10 py-10">
          {/* Quote */}
          <p className="font-serif italic text-center text-[#3a3a3a] text-lg leading-relaxed mb-8">
            "Honoring the past through impeccable service."
          </p>

          {/* Staff Identification */}
          <div className="mb-6">
            <label className="block text-xs font-semibold font-[font2] tracking-widest text-[#b8863b] mb-3">
              STAFF IDENTIFICATION
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
              className="w-full border-b-2 font-[font2] tracking-wider border-[#d4d4d4]  pb-2 text-sm text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none bg-transparent"
            />
          </div>

          {/* Authorization Cipher */}
          <div className="mb-10">
            <label className="block text-xs font-semibold font-[font2] tracking-widest text-[#b8863b] mb-3">
              AUTHORIZATION
            </label>
            <input
              type="password"
              value={cipher}
              onChange={(e) => setCipher(e.target.value)}
              placeholder="••••••••"
              className="w-full border-b border-[#d4d4d4]  font-[font2] tracking-wider pb-2 text-sm text-[#1a1a1a] placeholder-[#c4c4c4] focus:outline-none focus:border-[#1a1a1a] bg-transparent transition-colors"
            />
          </div>

          {/* Sign Button */}
          <button
            onClick={hadleSubmit}
            type="button"
            className="w-full bg-[#1a1a1a] font-[font2] tracking-widest hover:bg-[#2a2a2a] transition-colors text-white text-xs font-semibold  py-4 flex items-center justify-center gap-2 mb-6"
          >
            SIGN THE LEDGER
            <Pencil size={13} strokeWidth={2} />
          </button>

          <hr className="border-t border-[#e5e5e5] mb-6" />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="font-serif italic text-[#3a3a3a] mb-1">
            New to the Palace household?
          </p>
          <button
            type="button"
            className="text-sm font-semibold tracking-wide text-[#1a1a1a] underline underline-offset-4"
          >
            JOIN THE TEAM
          </button>
        </div>
      </div>
    </div>
  );
}
