import React, { useState } from "react";
import { Camera, ShieldCheck, KeyRound, Save, Sun, Moon } from "lucide-react";
import { cx, emailRe, phoneRe } from "../utils/helpers.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import Field from "../components/common/Field.jsx";
import TextInput from "../components/common/TextInput.jsx";
import Button from "../components/common/Button.jsx";

export default function ProfilePage({ user, setUser }) {
  const t = useTheme();
  const toast = useToast();
  const [form, setForm] = useState(user);
  const [errors, setErrors] = useState({});
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});

  const saveProfile = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!emailRe.test(form.email)) errs.email = "Enter a valid email address.";
    if (form.phone && !phoneRe.test(form.phone)) errs.phone = "Enter a valid phone number.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setUser(form);
    toast.success("Profile updated successfully.");
  };

  const changePassword = (e) => {
    e.preventDefault();
    const errs = {};
    if (!pw.current) errs.current = "Enter your current password.";
    if (pw.next.length < 8) errs.next = "New password must be at least 8 characters.";
    if (pw.confirm !== pw.next) errs.confirm = "Passwords do not match.";
    setPwErrors(errs);
    if (Object.keys(errs).length) return;
    setPw({ current: "", next: "", confirm: "" });
    toast.success("Password changed successfully.");
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className={cx("font-display font-semibold text-xl", t.text)}>My Profile</h2>
        <p className={cx("font-body text-sm", t.textMuted)}>Manage your personal information and account security.</p>
      </div>

      <div className={cx("rounded-2xl border p-5", t.surface, t.border)}>
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center font-display font-semibold text-xl">
              {form.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <button type="button" className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500">
              <Camera size={12} />
            </button>
          </div>
          <div>
            <p className={cx("font-display font-semibold", t.text)}>{form.name}</p>
            <p className={cx("font-body text-xs", t.textMuted)}>{form.role}</p>
          </div>
        </div>
        <form onSubmit={saveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name" required error={errors.name}>
            <TextInput error={errors.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Role"><TextInput value={form.role} disabled className="opacity-60" /></Field>
          <Field label="Email" required error={errors.email}>
            <TextInput error={errors.email} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <TextInput error={errors.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit"><Save size={15} /> Save changes</Button>
          </div>
        </form>
      </div>

      <div className={cx("rounded-2xl border p-5", t.surface, t.border)}>
        <h3 className={cx("font-display font-semibold text-sm mb-4 flex items-center gap-2", t.text)}>
          <ShieldCheck size={16} className="text-teal-600" /> Change password
        </h3>
        <form onSubmit={changePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Current password" error={pwErrors.current}>
            <TextInput error={pwErrors.current} type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
          </Field>
          <Field label="New password" error={pwErrors.next}>
            <TextInput error={pwErrors.next} type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
          </Field>
          <Field label="Confirm new password" error={pwErrors.confirm}>
            <TextInput error={pwErrors.confirm} type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
          </Field>
          <div className="sm:col-span-3 flex justify-end">
            <Button type="submit" variant="outline"><KeyRound size={15} /> Update password</Button>
          </div>
        </form>
      </div>

      <div className={cx("rounded-2xl border p-5 flex items-center justify-between", t.surface, t.border)}>
        <div>
          <h3 className={cx("font-display font-semibold text-sm", t.text)}>Appearance</h3>
          <p className={cx("font-body text-xs", t.textMuted)}>Switch between light and dark mode.</p>
        </div>
        <button onClick={t.toggle} className={cx("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-body", t.border, t.hover, t.text)}>
          {t.dark ? <Moon size={15} /> : <Sun size={15} />} {t.dark ? "Dark" : "Light"} mode
        </button>
      </div>
    </div>
  );
}
