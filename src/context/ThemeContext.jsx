import React, { createContext, useContext, useMemo, useState } from "react";

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  const value = useMemo(() => ({
    dark,
    toggle: () => setDark((d) => !d),
    page: dark ? "bg-slate-950" : "bg-slate-50",
    surface: dark ? "bg-slate-900" : "bg-white",
    surfaceAlt: dark ? "bg-slate-800/60" : "bg-slate-100",
    border: dark ? "border-slate-800" : "border-slate-200",
    text: dark ? "text-slate-100" : "text-slate-900",
    textMuted: dark ? "text-slate-400" : "text-slate-500",
    textSubtle: dark ? "text-slate-500" : "text-slate-400",
    hover: dark ? "hover:bg-slate-800" : "hover:bg-slate-100",
    input: dark
      ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400",
  }), [dark]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
