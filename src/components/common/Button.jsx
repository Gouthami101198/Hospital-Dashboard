import React from "react";
import { cx } from "../../utils/helpers.js";

export default function Button({ children, variant = "primary", size = "md", className = "", ...rest }) {
  const base = "inline-flex items-center justify-center gap-1.5 font-body font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "text-xs px-2.5 py-1.5", md: "text-sm px-3.5 py-2", lg: "text-sm px-5 py-2.5" };
  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-700 shadow-sm",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
  };
  return (
    <button className={cx(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
