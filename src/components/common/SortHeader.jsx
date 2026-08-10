import React from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cx } from "../../utils/helpers.js";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function SortHeader({ label, active, dir, onClick }) {
  const t = useTheme();
  return (
    <button onClick={onClick} className={cx("flex items-center gap-1 font-body font-semibold text-xs uppercase tracking-wide", t.textMuted, "hover:text-teal-600")}>
      {label}
      {active ? (dir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />) : <ChevronsUpDown size={13} className="opacity-40" />}
    </button>
  );
}
