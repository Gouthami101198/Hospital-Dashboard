import React from "react";
import PulseLogo from "../../components/common/PulseLogo.jsx";

export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-body relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #14b8a6 1px, transparent 0)", backgroundSize: "28px 28px" }}
      />
      <div className="w-full max-w-md relative">
        <div className="flex items-center gap-2 justify-center mb-6">
          <PulseLogo size={34} />
          <span className="font-display font-bold text-xl text-white tracking-tight">Vitalis</span>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-7 animate-in">{children}</div>
        <p className="text-center text-slate-500 text-xs mt-5">© 2026 Vitalis Health Systems. Clinical operations, unified.</p>
      </div>
    </div>
  );
}
