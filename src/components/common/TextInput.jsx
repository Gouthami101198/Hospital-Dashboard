import React from "react";
import { cx } from "../../utils/helpers.js";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function TextInput({ error, className = "", ...rest }) {
  const t = useTheme();
  return (
    <input
      className={cx(
        "w-full rounded-lg border px-3 py-2 text-sm font-body outline-none transition focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500",
        t.input,
        error && "border-rose-400",
        className
      )}
      {...rest}
    />
  );
}
