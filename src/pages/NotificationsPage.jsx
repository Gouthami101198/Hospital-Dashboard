import React, { useState } from "react";
import { CalendarDays, Receipt, Info, AlertTriangle, Bell } from "lucide-react";
import { cx } from "../utils/helpers.js";
import { useTheme } from "../context/ThemeContext.jsx";
import EmptyState from "../components/common/EmptyState.jsx";

const ICONS = { appointment: CalendarDays, billing: Receipt, system: Info, emergency: AlertTriangle };
const COLORS = {
  appointment: "bg-teal-50 text-teal-600",
  billing: "bg-amber-50 text-amber-600",
  system: "bg-slate-100 text-slate-500",
  emergency: "bg-rose-50 text-rose-600",
};

export default function NotificationsPage({ db, dispatch }) {
  const t = useTheme();
  const [filter, setFilter] = useState("all");
  const list = db.notifications.filter((n) => filter === "all" || n.type === filter);
  const markRead = (n) => dispatch({ type: "UPDATE", resource: "notifications", payload: { ...n, read: true } });
  const markAll = () => db.notifications.forEach((n) => !n.read && markRead(n));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className={cx("font-display font-semibold text-xl", t.text)}>Notifications</h2>
          <p className={cx("font-body text-sm", t.textMuted)}>{db.notifications.filter((n) => !n.read).length} unread</p>
        </div>
        <button onClick={markAll} className={cx("px-3.5 py-2 rounded-lg text-sm font-body border", t.border, t.hover, t.text)}>
          Mark all as read
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {["all", "appointment", "billing", "system", "emergency"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cx("px-3 py-1.5 rounded-full text-xs font-body font-medium border capitalize", filter === f ? "bg-teal-600 text-white border-teal-600" : cx(t.border, t.textMuted, t.hover))}
          >
            {f}
          </button>
        ))}
      </div>
      <div className={cx("rounded-2xl border divide-y", t.surface, t.border)}>
        {list.length === 0 ? (
          <EmptyState icon={Bell} title="You're all caught up" message="No notifications match this filter." />
        ) : (
          list.map((n) => {
            const Icon = ICONS[n.type];
            return (
              <div
                key={n.id}
                onClick={() => markRead(n)}
                className={cx("flex gap-3 p-4 cursor-pointer", t.border, !n.read && (t.dark ? "bg-slate-800/40" : "bg-teal-50/40"), t.hover)}
              >
                <div className={cx("w-9 h-9 rounded-full flex items-center justify-center shrink-0", COLORS[n.type])}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={cx("font-body text-sm font-medium truncate", t.text)}>{n.title}</p>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />}
                  </div>
                  <p className={cx("font-body text-xs mt-0.5", t.textMuted)}>{n.message}</p>
                </div>
                <span className={cx("font-body text-[11px] shrink-0", t.textSubtle)}>{n.time}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
