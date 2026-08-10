import React from "react";
import {
  LayoutDashboard, Users, Stethoscope, CalendarDays, BedDouble, Pill, Receipt,
  Bell, UserCircle, LogOut, X,
} from "lucide-react";
import { cx } from "../../utils/helpers.js";
import { useTheme } from "../../context/ThemeContext.jsx";
import PulseLogo from "../common/PulseLogo.jsx";

export const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "patients", label: "Patients", icon: Users },
  { key: "doctors", label: "Doctors", icon: Stethoscope },
  { key: "appointments", label: "Appointments", icon: CalendarDays },
  { key: "beds", label: "Bed Management", icon: BedDouble },
  { key: "pharmacy", label: "Pharmacy", icon: Pill },
  { key: "billing", label: "Billing", icon: Receipt },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "profile", label: "Profile", icon: UserCircle },
];

export default function Sidebar({ page, goTo, open, setOpen, onLogout, unread }) {
  const t = useTheme();
  return (
    <>
      {open && <div className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={cx(
        "fixed lg:sticky top-0 left-0 h-screen w-64 z-40 border-r flex flex-col transition-transform duration-200 lg:translate-x-0",
        t.surface, t.border, open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className={cx("flex items-center gap-2 px-5 h-16 border-b shrink-0", t.border)}>
          <PulseLogo size={30} />
          <span className={cx("font-display font-bold text-lg", t.text)}>Vitalis</span>
          <button onClick={() => setOpen(false)} className={cx("ml-auto lg:hidden p-1", t.textMuted)}>
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = page === n.key;
            return (
              <button
                key={n.key}
                onClick={() => { goTo(n.key); setOpen(false); }}
                className={cx(
                  "w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition",
                  active ? "bg-teal-600 text-white shadow-sm" : cx(t.textMuted, t.hover)
                )}
              >
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-white/70" />}
                <Icon size={17} />
                {n.label}
                {n.key === "notifications" && unread > 0 && (
                  <span className={cx("ml-auto text-[10px] font-data rounded-full px-1.5 py-0.5", active ? "bg-white/25 text-white" : "bg-rose-500 text-white")}>
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className={cx("p-3 border-t", t.border)}>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium text-rose-500 hover:bg-rose-50">
            <LogOut size={17} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}
