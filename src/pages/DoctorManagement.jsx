import React from "react";
import { Stethoscope } from "lucide-react";
import ResourceManager from "../components/resource/ResourceManager.jsx";
import { DEPARTMENTS, DOCTOR_STATUS_MAP } from "../utils/constants.js";

export default function DoctorManagement({ db, dispatch }) {
  return (
    <ResourceManager
      resource="doctors" dispatch={dispatch} items={db.doctors} idPrefix="D"
      title="Doctors" subtitle="Manage physician profiles, specializations, and availability." icon={Stethoscope}
      searchKeys={["name", "id", "specialization", "email"]}
      statusKey="availability" statusMap={DOCTOR_STATUS_MAP}
      filters={[
        { key: "availability", label: "statuses", options: ["Available", "In Surgery", "On Leave"] },
        { key: "department", label: "departments", options: DEPARTMENTS },
      ]}
      columns={[
        { key: "id", label: "ID", sortable: true, render: (r) => <span className="font-data text-xs">{r.id}</span> },
        { key: "name", label: "Name", sortable: true },
        { key: "specialization", label: "Specialization", sortable: true },
        { key: "experience", label: "Exp.", sortable: true, render: (r) => `${r.experience} yrs` },
        { key: "schedule", label: "Schedule", sortable: false, render: (r) => <span className="font-data text-xs">{r.schedule}</span> },
        { key: "rating", label: "Rating", sortable: true, render: (r) => `★ ${r.rating}` },
        { key: "availability", label: "Availability", sortable: true },
      ]}
      formFields={[
        { key: "name", label: "Full name", required: true },
        { key: "specialization", label: "Specialization", type: "select", options: DEPARTMENTS, required: true },
        { key: "department", label: "Department", type: "select", options: DEPARTMENTS, required: true },
        { key: "experience", label: "Experience (years)", type: "number", min: 0, required: true },
        { key: "contact", label: "Phone", type: "tel", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "schedule", label: "Schedule", required: true, placeholder: "e.g. Mon–Fri · 9:00–17:00" },
        { key: "availability", label: "Availability", type: "select", options: ["Available", "In Surgery", "On Leave"], required: true },
      ]}
    />
  );
}
