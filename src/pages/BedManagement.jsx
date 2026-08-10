import React, { useState } from "react";
import { BedDouble } from "lucide-react";
import { Save } from "lucide-react";
import { cx } from "../utils/helpers.js";
import { WARDS, BED_STATUS_MAP } from "../utils/constants.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import Modal from "../components/common/Modal.jsx";
import Field from "../components/common/Field.jsx";
import TextInput from "../components/common/TextInput.jsx";
import Button from "../components/common/Button.jsx";

export default function BedManagement({ db, dispatch }) {
  const t = useTheme();
  const toast = useToast();
  const [ward, setWard] = useState("All");
  const [selected, setSelected] = useState(null);
  const [assignName, setAssignName] = useState("");

  const beds = db.beds.filter((b) => ward === "All" || b.ward === ward);
  const counts = ["Available", "Occupied", "Cleaning", "Maintenance"].map((s) => ({ s, n: db.beds.filter((b) => b.status === s).length }));

  const openBed = (b) => { setSelected(b); setAssignName(b.patient || ""); };

  const saveBed = () => {
    if (selected.status !== "Occupied" && assignName.trim()) {
      dispatch({ type: "UPDATE", resource: "beds", payload: { ...selected, status: "Occupied", patient: assignName.trim(), since: "2026-08-06" } });
      toast.success(`${assignName.trim()} assigned to bed ${selected.id}.`);
    } else if (selected.status === "Occupied" && !assignName.trim()) {
      dispatch({ type: "UPDATE", resource: "beds", payload: { ...selected, status: "Cleaning", patient: null, since: null } });
      toast.info(`Bed ${selected.id} discharged and marked for cleaning.`);
    } else {
      dispatch({ type: "UPDATE", resource: "beds", payload: { ...selected, patient: assignName.trim() || null } });
      toast.success(`Bed ${selected.id} updated.`);
    }
    setSelected(null);
  };

  const cycleStatus = (b, status) => {
    dispatch({ type: "UPDATE", resource: "beds", payload: { ...b, status, patient: status === "Occupied" ? b.patient : null } });
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className={cx("font-display font-semibold text-xl", t.text)}>Bed Management</h2>
        <p className={cx("font-body text-sm", t.textMuted)}>Live status across all wards. Click a bed to assign or discharge a patient.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {counts.map(({ s, n }) => (
          <div key={s} className={cx("rounded-2xl border p-3.5 flex items-center gap-3", t.surface, t.border)}>
            <span className={cx("w-2.5 h-2.5 rounded-full", BED_STATUS_MAP[s])} />
            <div>
              <p className={cx("font-display font-bold text-lg", t.text)}>{n}</p>
              <p className={cx("font-body text-xs", t.textMuted)}>{s}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", ...WARDS].map((w) => (
          <button
            key={w}
            onClick={() => setWard(w)}
            className={cx("px-3 py-1.5 rounded-full text-xs font-body font-medium border", ward === w ? "bg-teal-600 text-white border-teal-600" : cx(t.border, t.textMuted, t.hover))}
          >
            {w}
          </button>
        ))}
      </div>

      <div className={cx("rounded-2xl border p-5", t.surface, t.border)}>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {beds.map((b) => (
            <button
              key={b.id}
              onClick={() => openBed(b)}
              className={cx("aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 transition hover:scale-[1.04] hover:shadow-md", t.border, t.surfaceAlt)}
            >
              <BedDouble
                size={18}
                className={cx(
                  b.status === "Available" && "text-emerald-500",
                  b.status === "Occupied" && "text-rose-500",
                  b.status === "Cleaning" && "text-amber-500",
                  b.status === "Maintenance" && "text-slate-400"
                )}
              />
              <span className={cx("font-data text-[10px] font-medium", t.text)}>{b.id}</span>
            </button>
          ))}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Bed ${selected?.id || ""}`}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={cx("font-body text-sm", t.textMuted)}>Ward</span>
              <span className={cx("font-body text-sm font-medium", t.text)}>{selected.ward}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={cx("font-body text-sm", t.textMuted)}>Status</span>
              <StatusBadge
                value={selected.status}
                map={{
                  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
                  Occupied: "bg-rose-50 text-rose-700 border-rose-200",
                  Cleaning: "bg-amber-50 text-amber-700 border-amber-200",
                  Maintenance: "bg-slate-100 text-slate-600 border-slate-200",
                }}
              />
            </div>
            <Field label="Patient name">
              <TextInput value={assignName} onChange={(e) => setAssignName(e.target.value)} placeholder="Leave blank to discharge" />
            </Field>
            <div className="flex flex-wrap gap-2">
              {["Available", "Cleaning", "Maintenance"].filter((s) => s !== selected.status).map((s) => (
                <Button key={s} size="sm" variant="outline" onClick={() => cycleStatus(selected, s)}>Mark {s}</Button>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
              <Button onClick={saveBed}><Save size={15} /> Save</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
