import React from "react";
import { X } from "lucide-react";
import { cx } from "../../utils/helpers.js";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function Modal({ open, onClose, title, children, wide }) {
  const t = useTheme();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cx("relative w-full animate-in rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto", wide ? "max-w-2xl" : "max-w-md", t.surface, t.border)}>
        <div className={cx("flex items-center justify-between px-5 py-4 border-b sticky top-0", t.surface, t.border)}>
          <h3 className={cx("font-display font-semibold text-base", t.text)}>{title}</h3>
          <button onClick={onClose} className={cx("p-1.5 rounded-lg", t.hover, t.textMuted)}>
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
