import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "../../utils/helpers.js";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function Pagination({ page, pages, onChange, total, pageSize }) {
  const t = useTheme();
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 pt-3">
      <p className={cx("text-xs font-body", t.textMuted)}>
        Showing <span className="font-medium">{from}–{to}</span> of <span className="font-medium">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button disabled={page <= 1} onClick={() => onChange(page - 1)} className={cx("p-1.5 rounded-lg disabled:opacity-30", t.hover, t.textMuted)}>
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i + 1)}
            className={cx("w-7 h-7 rounded-lg text-xs font-body font-medium", page === i + 1 ? "bg-teal-600 text-white" : cx(t.hover, t.textMuted))}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={page >= pages} onClick={() => onChange(page + 1)} className={cx("p-1.5 rounded-lg disabled:opacity-30", t.hover, t.textMuted)}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
