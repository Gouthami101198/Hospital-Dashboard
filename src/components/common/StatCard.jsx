import React from "react";
import { TrendingUp } from "lucide-react";
import { cx } from "../../utils/helpers.js";
import { useTheme } from "../../context/ThemeContext.jsx";

const ACCENTS = {
  teal: "bg-teal-50 text-teal-600",
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

export default function StatCard({ label, value, delta, icon: Icon, accent }) {
  const t = useTheme();
  return (
    <div className={cx("rounded-2xl border p-4 relative overflow-hidden", t.surface, t.border)}>
      <div className="flex items-start justify-between">
        <div>
          <p className={cx("font-body text-xs", t.textMuted)}>{label}</p>
          <p className={cx("font-display font-bold text-2xl mt-1", t.text)}>{value}</p>
        </div>
        <div className={cx("w-10 h-10 rounded-xl flex items-center justify-center", ACCENTS[accent])}>
          <Icon size={18} />
        </div>
      </div>
      {delta && (
        <p className="mt-2 text-xs font-body text-emerald-600 flex items-center gap-1">
          <TrendingUp size={12} />
          {delta}
        </p>
      )}
    </div>
  );
}
