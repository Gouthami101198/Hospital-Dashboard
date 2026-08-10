import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { cx, uid } from "../utils/helpers.js";

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

const ICONS = { success: CheckCircle2, error: XCircle, info: Info, warning: AlertTriangle };
const COLORS = {
  success: "border-emerald-300 bg-emerald-50 text-emerald-800",
  error: "border-rose-300 bg-rose-50 text-rose-800",
  info: "border-teal-300 bg-teal-50 text-teal-800",
  warning: "border-amber-300 bg-amber-50 text-amber-800",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((type, message) => {
    const id = uid("T");
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const api = useMemo(() => ({
    success: (m) => push("success", m),
    error: (m) => push("error", m),
    info: (m) => push("info", m),
    warning: (m) => push("warning", m),
  }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div key={t.id} className={cx("animate-in flex items-start gap-2 rounded-lg border shadow-lg px-4 py-3 font-body text-sm", COLORS[t.type])}>
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1 leading-snug">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
