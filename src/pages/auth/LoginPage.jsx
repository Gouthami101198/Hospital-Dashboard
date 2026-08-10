import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { cx, emailRe } from "../../utils/helpers.js";
import { useToast } from "../../context/ToastContext.jsx";
import Field from "../../components/common/Field.jsx";
import Button from "../../components/common/Button.jsx";

export default function LoginPage({ onLogin, goTo }) {
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!emailRe.test(form.email)) errs.email = "Enter a valid email address.";
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) { toast.error("Please fix the highlighted fields before signing in."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success("Welcome back to Vitalis."); onLogin(form.email); }, 700);
  };

  return (
    <>
      <h1 className="font-display font-semibold text-xl text-slate-900">Sign in to your dashboard</h1>
      <p className="text-sm text-slate-500 mt-1 mb-6">Enter your credentials to access patient and hospital records.</p>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Work email" required error={errors.email}>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={cx("w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500", errors.email ? "border-rose-400" : "border-slate-300")}
              placeholder="you@vitalis.org"
            />
          </div>
        </Field>
        <Field label="Password" required error={errors.password}>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={cx("w-full pl-9 pr-9 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500", errors.password ? "border-rose-400" : "border-slate-300")}
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>
        <div className="flex justify-end -mt-1">
          <button type="button" onClick={() => goTo("forgot")} className="text-xs font-medium text-teal-600 hover:underline">Forgot password?</button>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
        <p className="text-center text-xs text-slate-400">Demo mode — credentials are pre-filled. Just press Sign in.</p>
      </form>
    </>
  );
}
