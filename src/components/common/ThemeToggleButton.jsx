import React from "react";
import { Sun, Moon } from "lucide-react";
import { cx } from "../../utils/helpers.js";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function ThemeToggleButton() {
  const t = useTheme();
  return (
    <button onClick={t.toggle} className={cx("p-2 rounded-lg", t.hover, t.textMuted)} title="Toggle theme">
      {t.dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
