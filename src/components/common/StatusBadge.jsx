import React from "react";
import { cx } from "../../utils/helpers.js";

export default function StatusBadge({ value, map }) {
  const cls = map[value] || "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium font-body", cls)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}
