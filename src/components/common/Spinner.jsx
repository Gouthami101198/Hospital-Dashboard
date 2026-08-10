import React from "react";

export default function Spinner({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" stroke="#CCFBF1" strokeWidth="5" />
        <path d="M24 4a20 20 0 0 1 20 20" stroke="#0D9488" strokeWidth="5" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="0.9s" repeatCount="indefinite" />
        </path>
      </svg>
      <span className="text-xs font-body text-slate-400">{label}…</span>
    </div>
  );
}
