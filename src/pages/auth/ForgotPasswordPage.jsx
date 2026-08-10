import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cx, emailRe } from "../../utils/helpers.js";
import { useToast } from "../../context/ToastContext.jsx";
import Field from "../../components/common/Field.jsx";
import Button from "../../components/common/Button.jsx";

export default function ForgotPasswordPage({ goTo }) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!emailRe.test(email)) { setError("Enter a valid email address."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); toast.info("Reset link sent to your inbox."); }, 700);
  };

  return (
    <>
      <button onClick={() => goTo("login")} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft size={14} /> Back to sign in
      </button>
      <h1 className="font-display font-semibold text-xl text-slate-900">Reset your password</h1>
      <p className="text-sm text-slate-500 mt-1 mb-6">We'll email you a link to reset your password.</p>
      {sent ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={22} />
          </div>
          <p className="text-sm text-slate-700 font-medium">Check your email</p>
          <p className="text-xs text-slate-500 mt-1 mb-5">We sent a reset link to {email}</p>
          <Button variant="outline" className="w-full" onClick={() => goTo("reset")}>Continue to reset password</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Work email" required error={error}>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@vitalis.org"
                className={cx("w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500", error ? "border-rose-400" : "border-slate-300")}
              />
            </div>
          </Field>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Sending…" : "Send reset link"}</Button>
        </form>
      )}
    </>
  );
}
