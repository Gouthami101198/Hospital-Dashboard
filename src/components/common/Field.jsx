import React from "react";
import { AlertCircle } from "lucide-react";

export default function Field({ label, error, children, required }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium font-body text-slate-600 mb-1">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1 flex items-center gap-1 text-xs text-rose-600 font-body">
          <AlertCircle size={12} />
          {error}
        </span>
      )}
    </label>
  );
}
