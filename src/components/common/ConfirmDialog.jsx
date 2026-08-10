import React from "react";
import { AlertTriangle } from "lucide-react";
import { cx } from "../../utils/helpers.js";
import { useTheme } from "../../context/ThemeContext.jsx";
import Button from "./Button.jsx";

export default function ConfirmDialog({ open, onCancel, onConfirm, itemLabel }) {
  const t = useTheme();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
      <div className={cx("relative w-full max-w-sm animate-in rounded-2xl shadow-2xl border p-5", t.surface, t.border)}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} />
          </div>
          <h3 className={cx("font-display font-semibold text-base", t.text)}>Delete record?</h3>
        </div>
        <p className={cx("text-sm font-body mb-5", t.textMuted)}>
          This will permanently remove <span className="font-medium">{itemLabel}</span>. This action can't be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
