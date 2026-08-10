import React, { useState } from "react";
import { Menu, Search, Bell, UserCircle } from "lucide-react";
import { cx } from "../../utils/helpers.js";
import { useTheme } from "../../context/ThemeContext.jsx";
import ThemeToggleButton from "../common/ThemeToggleButton.jsx";

export default function Topbar({ setOpen, user, unread, goTo }) {
  const t = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className={cx("sticky top-0 z-20 h-16 flex items-center gap-3 px-4 sm:px-6 border-b backdrop-blur", t.surface, t.border)}>
      <button onClick={() => setOpen(true)} className={cx("lg:hidden p-2 rounded-lg", t.hover, t.textMuted)}>
        <Menu size={20} />
      </button>
      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search size={15} className={cx("absolute left-3 top-1/2 -translate-y-1/2", t.textSubtle)} />
        <input
          placeholder="Search patients, doctors, invoices…"
          className={cx("w-full pl-9 pr-3 py-2 rounded-lg border text-sm font-body outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500", t.input)}
        />
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <ThemeToggleButton />
        <button onClick={() => goTo("notifications")} className={cx("relative p-2 rounded-lg", t.hover, t.textMuted)}>
          <Bell size={18} />
          {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />}
        </button>
        <div className="relative">
          <button onClick={() => setMenuOpen((m) => !m)} className="flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-display text-xs font-semibold">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
          </button>
          {menuOpen && (
            <div className={cx("absolute right-0 mt-2 w-48 rounded-xl border shadow-lg py-1 animate-in", t.surface, t.border)} onMouseLeave={() => setMenuOpen(false)}>
              <div className={cx("px-3 py-2 border-b", t.border)}>
                <p className={cx("font-body text-sm font-medium truncate", t.text)}>{user.name}</p>
                <p className={cx("font-body text-xs truncate", t.textMuted)}>{user.email}</p>
              </div>
              <button onClick={() => { goTo("profile"); setMenuOpen(false); }} className={cx("w-full text-left px-3 py-2 text-sm font-body flex items-center gap-2", t.hover, t.text)}>
                <UserCircle size={15} /> View profile
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
