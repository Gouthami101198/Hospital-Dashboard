import React, { useState } from "react";
import { Lock, ArrowLeft } from "lucide-react";
import { cx } from "../../utils/helpers.js";
import { useToast } from "../../context/ToastContext.jsx";
import Field from "../../components/common/Field.jsx";
import Button from "../../components/common/Button.jsx";

export default function ResetPasswordPage({ goTo }) {
  const toast = useToast();
  const [form, setForm] = useState({ next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (form.next.length < 8) errs.next = "Password must be at least 8 characters.";
    if (form.confirm !== form.next) errs.confirm = "Passwords do not match.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success("Password reset. Please sign in."); goTo("login"); }, 700);
  };

  return (
    <>
      <button onClick={() => goTo("login")} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft size={14} /> Back to sign in
      </button>
      <h1 className="font-display font-semibold text-xl text-slate-900">Set a new password</h1>
      <p className="text-sm text-slate-500 mt-1 mb-6">Choose a strong password you haven't used before.</p>
      <form onSubmit={submit} className="space-y-4">
        <Field label="New password" required error={errors.next}>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={form.next}
              onChange={(e) => setForm({ ...form, next: e.target.value })}
              className={cx("w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500", errors.next ? "border-rose-400" : "border-slate-300")}
            />
          </div>
        </Field>
        <Field label="Confirm new password" required error={errors.confirm}>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className={cx("w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500", errors.confirm ? "border-rose-400" : "border-slate-300")}
            />
          </div>
        </Field>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Resetting…" : "Reset password"}</Button>
      </form>
    </>
  );
}
