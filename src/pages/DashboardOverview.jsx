import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import {
  Users, Stethoscope, CalendarDays, BedDouble, TrendingUp, DollarSign,
  PackageX, Timer, HeartPulse, AlertTriangle, ChevronRight, Receipt, Pill,
} from "lucide-react";
import { cx, fmtCurrency } from "../utils/helpers.js";
import { DEPARTMENTS } from "../utils/constants.js";
import { useTheme } from "../context/ThemeContext.jsx";
import StatCard from "../components/common/StatCard.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import { APPT_STATUS_MAP } from "../utils/constants.js";

const trendData = [
  { m: "Mar", admissions: 210, discharges: 190 }, { m: "Apr", admissions: 240, discharges: 220 },
  { m: "May", admissions: 260, discharges: 250 }, { m: "Jun", admissions: 300, discharges: 270 },
  { m: "Jul", admissions: 280, discharges: 290 }, { m: "Aug", admissions: 320, discharges: 300 },
];
const deptData = DEPARTMENTS.slice(0, 6).map((d, i) => ({ dept: d, patients: 30 + ((i * 37) % 90) }));

// Deterministic mock — average time (in minutes) patients currently wait in triage/reception.
const AVG_WAIT_MINUTES = 18;

export default function DashboardOverview({ db, goTo }) {
  const t = useTheme();

  const occupied = db.beds.filter((b) => b.status === "Occupied").length;
  const revenue = db.invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + Number(i.amount), 0);
  const today = db.appointments.filter((a) => a.date === "2026-08-06");
  const pieData = ["Available", "Occupied", "Cleaning", "Maintenance"].map((s) => ({ name: s, value: db.beds.filter((b) => b.status === s).length }));
  const pieColors = { Available: "#10b981", Occupied: "#f43f5e", Cleaning: "#f59e0b", Maintenance: "#94a3b8" };

  // --- extra dashboard metrics -------------------------------------------------
  const lowStockItems = db.pharmacy.filter((p) => p.status === "Low Stock" || p.status === "Out of Stock");
  const icuBeds = db.beds.filter((b) => b.ward === "ICU");
  const icuOccupied = icuBeds.filter((b) => b.status === "Occupied").length;
  const icuPct = icuBeds.length ? Math.round((icuOccupied / icuBeds.length) * 100) : 0;

  // --- upcoming appointments (soonest scheduled, sorted by date/time) ---------
  const upcoming = [...db.appointments]
    .filter((a) => a.status === "Scheduled")
    .sort((a, b) => (a.date + " " + a.time).localeCompare(b.date + " " + b.time))
    .slice(0, 5);

  // --- critical alerts: emergencies, overdue bills, low/out of stock meds -----
  const overdueInvoices = db.invoices.filter((i) => i.status === "Overdue");
  const emergencyNotifs = db.notifications.filter((n) => n.type === "emergency");
  const criticalAlerts = [
    ...emergencyNotifs.map((n) => ({ id: n.id, icon: AlertTriangle, tone: "rose", label: n.title, detail: n.message })),
    ...overdueInvoices.slice(0, 3).map((i) => ({ id: i.id, icon: Receipt, tone: "amber", label: `Overdue invoice · ${i.id}`, detail: `${i.patientName} — ${fmtCurrency(i.amount)} past due` })),
    ...lowStockItems.slice(0, 3).map((p) => ({ id: p.id, icon: Pill, tone: "amber", label: `${p.status} · ${p.name}`, detail: `${p.stock} ${p.unit} remaining · reorder from ${p.supplier}` })),
  ].slice(0, 6);

  const toneClasses = {
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
  };

  // --- revenue trend: mock 5 prior months, tie the final point to real data ---
  const revenueTrend = [
    { m: "Mar", revenue: 41200 }, { m: "Apr", revenue: 46800 }, { m: "May", revenue: 52100 },
    { m: "Jun", revenue: 49500 }, { m: "Jul", revenue: 58300 },
    { m: "Aug", revenue: Math.round(revenue) || 61200 },
  ];

  // --- doctor workload: appointment count per doctor, busiest first ----------
  const workloadMap = {};
  db.appointments.forEach((a) => { workloadMap[a.doctorName] = (workloadMap[a.doctorName] || 0) + 1; });
  const doctorWorkload = Object.entries(workloadMap)
    .map(([name, count]) => ({ name: name.replace("Dr. ", ""), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // --- patient demographics: gender split + age bracket distribution ---------
  const genderCounts = ["Female", "Male", "Other"]
    .map((g) => ({ name: g, value: db.patients.filter((p) => p.gender === g).length }))
    .filter((g) => g.value > 0);
  const genderColors = { Female: "#0d9488", Male: "#f59e0b", Other: "#94a3b8" };

  const ageBrackets = [
    { label: "0–18", min: 0, max: 18 }, { label: "19–35", min: 19, max: 35 },
    { label: "36–50", min: 36, max: 50 }, { label: "51–65", min: 51, max: 65 },
    { label: "65+", min: 66, max: 200 },
  ];
  const ageData = ageBrackets.map((b) => ({
    label: b.label,
    count: db.patients.filter((p) => p.age >= b.min && p.age <= b.max).length,
  }));

  return (
    <div className="space-y-5">
      <div>
        <h2 className={cx("font-display font-semibold text-xl", t.text)}>Good morning, Dr. Gouthami C</h2>
        <p className={cx("font-body text-sm", t.textMuted)}>Here's what's happening across Vitalis today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Patients" value={db.patients.length} delta="+4.2% this month" icon={Users} accent="teal" />
        <StatCard label="Doctors on Duty" value={db.doctors.filter((d) => d.availability !== "On Leave").length} delta={`${db.doctors.length} total staff`} icon={Stethoscope} accent="emerald" />
        <StatCard label="Today's Appointments" value={today.length || 6} delta="2 emergencies flagged" icon={CalendarDays} accent="amber" />
        <StatCard label="Beds Occupied" value={`${occupied}/${db.beds.length}`} delta={`${Math.round((occupied / db.beds.length) * 100)}% occupancy`} icon={BedDouble} accent="rose" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Low Stock Alerts"
          value={lowStockItems.length}
          delta={lowStockItems.length ? "Reorder recommended" : "All medicines stocked"}
          icon={PackageX}
          accent={lowStockItems.length ? "rose" : "emerald"}
        />
        <StatCard label="Avg. Wait Time" value={`${AVG_WAIT_MINUTES} min`} delta="Triage to consultation" icon={Timer} accent="teal" />
        <StatCard
          label="ICU Capacity"
          value={`${icuPct}%`}
          delta={`${icuOccupied}/${icuBeds.length} beds in use`}
          icon={HeartPulse}
          accent={icuPct >= 80 ? "rose" : icuPct >= 50 ? "amber" : "emerald"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={cx("lg:col-span-2 rounded-2xl border p-5", t.surface, t.border)}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={cx("font-display font-semibold text-sm", t.text)}>Admissions vs Discharges</h3>
              <p className={cx("font-body text-xs", t.textMuted)}>Last 6 months</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-body text-emerald-600 bg-emerald-50 rounded-full px-2 py-1">
              <TrendingUp size={12} /> Trending up
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="adm" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} /><stop offset="95%" stopColor="#0d9488" stopOpacity={0} /></linearGradient>
                <linearGradient id="dis" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.dark ? "#1e293b" : "#e2e8f0"} />
              <XAxis dataKey="m" tick={{ fontSize: 12, fill: t.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: t.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: "1px solid #e2e8f0" }} />
              <Area type="monotone" dataKey="admissions" stroke="#0d9488" fill="url(#adm)" strokeWidth={2} />
              <Area type="monotone" dataKey="discharges" stroke="#f59e0b" fill="url(#dis)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={cx("rounded-2xl border p-5", t.surface, t.border)}>
          <h3 className={cx("font-display font-semibold text-sm mb-1", t.text)}>Bed Occupancy</h3>
          <p className={cx("font-body text-xs mb-2", t.textMuted)}>Across all wards</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={3}>
                {pieData.map((e, i) => <Cell key={i} fill={pieColors[e.name]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {pieData.map((e) => (
              <div key={e.name} className="flex items-center gap-1.5 text-xs font-body">
                <span className="w-2 h-2 rounded-full" style={{ background: pieColors[e.name] }} />
                <span className={t.textMuted}>{e.name}</span>
                <span className={cx("ml-auto font-medium", t.text)}>{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={cx("lg:col-span-2 rounded-2xl border p-5", t.surface, t.border)}>
          <h3 className={cx("font-display font-semibold text-sm mb-4", t.text)}>Patients by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.dark ? "#1e293b" : "#e2e8f0"} />
              <XAxis dataKey="dept" tick={{ fontSize: 11, fill: t.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 12, fill: t.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="patients" fill="#0d9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={cx("rounded-2xl border p-5", t.surface, t.border)}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={cx("font-display font-semibold text-sm", t.text)}>Recent Appointments</h3>
            <button onClick={() => goTo("appointments")} className="text-xs font-body text-teal-600 hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {db.appointments.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 font-display text-xs font-semibold">
                  {a.patientName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cx("font-body text-xs font-medium truncate", t.text)}>{a.patientName}</p>
                  <p className={cx("font-body text-[11px] truncate", t.textMuted)}>{a.doctorName} · {a.time}</p>
                </div>
                <StatusBadge value={a.status} map={APPT_STATUS_MAP} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className={cx("font-display font-semibold text-base mb-3", t.text)}>More Insights</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={cx("rounded-2xl border p-5", t.surface, t.border)}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className={cx("font-display font-semibold text-sm", t.text)}>Revenue Trend</h4>
                <p className={cx("font-body text-xs", t.textMuted)}>Collected revenue, last 6 months</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-body text-emerald-600 bg-emerald-50 rounded-full px-2 py-1">
                <TrendingUp size={12} /> +18% vs Mar
              </span>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.dark ? "#1e293b" : "#e2e8f0"} />
                <XAxis dataKey="m" tick={{ fontSize: 12, fill: t.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: t.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                <Tooltip formatter={(v) => fmtCurrency(v)} contentStyle={{ borderRadius: 10, fontSize: 12, border: "1px solid #e2e8f0" }} />
                <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3, fill: "#0d9488" }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={cx("rounded-2xl border p-5", t.surface, t.border)}>
            <h4 className={cx("font-display font-semibold text-sm mb-1", t.text)}>Doctor Workload</h4>
            <p className={cx("font-body text-xs mb-3", t.textMuted)}>Appointments handled, busiest first</p>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={doctorWorkload} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={t.dark ? "#1e293b" : "#e2e8f0"} />
                <XAxis type="number" tick={{ fontSize: 12, fill: t.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: t.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="count" fill="#0d9488" radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={cx("rounded-2xl border p-5", t.surface, t.border)}>
            <h4 className={cx("font-display font-semibold text-sm mb-1", t.text)}>Patients by Gender</h4>
            <p className={cx("font-body text-xs mb-2", t.textMuted)}>Current patient roster</p>
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={genderCounts} dataKey="value" nameKey="name" innerRadius={45} outerRadius={72} paddingAngle={3}>
                  {genderCounts.map((e, i) => <Cell key={i} fill={genderColors[e.name]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-1">
              {genderCounts.map((e) => (
                <div key={e.name} className="flex items-center gap-1.5 text-xs font-body">
                  <span className="w-2 h-2 rounded-full" style={{ background: genderColors[e.name] }} />
                  <span className={t.textMuted}>{e.name}</span>
                  <span className={cx("font-medium", t.text)}>{e.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={cx("rounded-2xl border p-5", t.surface, t.border)}>
            <h4 className={cx("font-display font-semibold text-sm mb-1", t.text)}>Patient Age Distribution</h4>
            <p className={cx("font-body text-xs mb-3", t.textMuted)}>By age bracket</p>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.dark ? "#1e293b" : "#e2e8f0"} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: t.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: t.dark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={cx("rounded-2xl border p-5", t.surface, t.border)}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className={cx("font-display font-semibold text-sm", t.text)}>Upcoming Appointments</h3>
              <p className={cx("font-body text-xs", t.textMuted)}>Next scheduled visits, soonest first</p>
            </div>
            <button onClick={() => goTo("appointments")} className="flex items-center gap-0.5 text-xs font-body text-teal-600 hover:underline shrink-0">
              View all <ChevronRight size={13} />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <p className={cx("font-body text-xs py-6 text-center", t.textMuted)}>No scheduled appointments right now.</p>
          ) : (
            <div className="space-y-1">
              {upcoming.map((a) => (
                <div key={a.id} className={cx("flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg transition", t.hover)}>
                  <div className={cx("flex flex-col items-center justify-center w-11 h-11 rounded-lg shrink-0", t.surfaceAlt)}>
                    <span className="font-display text-[10px] font-semibold text-teal-600 leading-none">{a.date.slice(5).replace("-", "/")}</span>
                    <span className={cx("font-data text-[10px] mt-0.5", t.textMuted)}>{a.time}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cx("font-body text-xs font-medium truncate", t.text)}>{a.patientName} <span className={cx("font-normal", t.textMuted)}>· {a.type}</span></p>
                    <p className={cx("font-body text-[11px] truncate", t.textMuted)}>{a.doctorName} — {a.department}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={cx("rounded-2xl border p-5", t.surface, t.border)}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className={cx("font-display font-semibold text-sm", t.text)}>Critical Alerts</h3>
              <p className={cx("font-body text-xs", t.textMuted)}>Emergencies, overdue bills & low stock</p>
            </div>
            <button onClick={() => goTo("notifications")} className="flex items-center gap-0.5 text-xs font-body text-teal-600 hover:underline shrink-0">
              View all <ChevronRight size={13} />
            </button>
          </div>
          {criticalAlerts.length === 0 ? (
            <p className={cx("font-body text-xs py-6 text-center", t.textMuted)}>No critical alerts — everything looks steady.</p>
          ) : (
            <div className="space-y-1">
              {criticalAlerts.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.id} className={cx("flex items-start gap-3 py-2 px-2 -mx-2 rounded-lg transition", t.hover)}>
                    <div className={cx("w-8 h-8 rounded-full flex items-center justify-center shrink-0", toneClasses[a.tone])}>
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cx("font-body text-xs font-medium truncate", t.text)}>{a.label}</p>
                      <p className={cx("font-body text-[11px] truncate", t.textMuted)}>{a.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <p className={cx("flex items-center gap-1.5 text-xs font-body pt-1", t.textSubtle)}>
        <DollarSign size={13} /> Total revenue collected to date: <span className={cx("font-medium font-data", t.text)}>{fmtCurrency(revenue)}</span>
      </p>
    </div>
  );
}
