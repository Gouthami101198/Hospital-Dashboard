export const DEPARTMENTS = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology", "General Medicine", "Dermatology", "ENT"];
export const WARDS = ["General Ward", "ICU", "Pediatric Ward", "Maternity Ward"];

export const APPT_STATUS_MAP = {
  Scheduled: "bg-teal-50 text-teal-700 border-teal-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};
export const PATIENT_STATUS_MAP = {
  Admitted: "bg-teal-50 text-teal-700 border-teal-200",
  Outpatient: "bg-amber-50 text-amber-700 border-amber-200",
  Discharged: "bg-slate-100 text-slate-600 border-slate-200",
};
export const DOCTOR_STATUS_MAP = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "In Surgery": "bg-amber-50 text-amber-700 border-amber-200",
  "On Leave": "bg-slate-100 text-slate-600 border-slate-200",
};
export const STOCK_STATUS_MAP = {
  "In Stock": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Low Stock": "bg-amber-50 text-amber-700 border-amber-200",
  "Out of Stock": "bg-rose-50 text-rose-700 border-rose-200",
};
export const INVOICE_STATUS_MAP = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Overdue: "bg-rose-50 text-rose-700 border-rose-200",
};
export const BED_STATUS_MAP = {
  Available: "bg-emerald-500", Occupied: "bg-rose-500", Cleaning: "bg-amber-500", Maintenance: "bg-slate-400",
};
