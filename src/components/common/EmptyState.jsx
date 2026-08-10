import React from "react";
import { cx } from "../../utils/helpers.js";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function EmptyState({ icon: Icon, title, message }) {
  const t = useTheme();
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center px-4">
      <div className={cx("w-12 h-12 rounded-full flex items-center justify-center mb-3", t.surfaceAlt, t.textMuted)}>
        <Icon size={22} />
      </div>
      <p className={cx("font-display font-medium text-sm", t.text)}>{title}</p>
      <p className={cx("font-body text-xs mt-1 max-w-xs", t.textMuted)}>{message}</p>
    </div>
  );
}
