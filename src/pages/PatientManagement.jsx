import React from "react";
import { Users, Droplet } from "lucide-react";
import ResourceManager from "../components/resource/ResourceManager.jsx";
import { DEPARTMENTS, PATIENT_STATUS_MAP } from "../utils/constants.js";

export default function PatientManagement({ db, dispatch }) {
  return (
    <ResourceManager
      resource="patients" dispatch={dispatch} items={db.patients} idPrefix="P"
      title="Patients" subtitle="View, search, and manage patient records." icon={Users}
      searchKeys={["name", "id", "doctor", "email"]}
      statusKey="status" statusMap={PATIENT_STATUS_MAP}
      filters={[
        { key: "status", label: "statuses", options: ["Admitted", "Outpatient", "Discharged"] },
        { key: "department", label: "departments", options: DEPARTMENTS },
      ]}
      columns={[
        { key: "id", label: "ID", sortable: true, render: (r) => <span className="font-data text-xs">{r.id}</span> },
        { key: "name", label: "Name", sortable: true },
        { key: "age", label: "Age", sortable: true },
        { key: "gender", label: "Gender", sortable: false },
        { key: "bloodGroup", label: "Blood", sortable: false, render: (r) => <span className="inline-flex items-center gap-1"><Droplet size={11} className="text-rose-400" />{r.bloodGroup}</span> },
        { key: "doctor", label: "Doctor", sortable: true },
        { key: "department", label: "Department", sortable: true },
        { key: "status", label: "Status", sortable: true },
      ]}
      formFields={[
        { key: "name", label: "Full name", required: true },
        { key: "age", label: "Age", type: "number", min: 0, required: true },
        { key: "gender", label: "Gender", type: "select", options: ["Female", "Male", "Other"], required: true },
        { key: "bloodGroup", label: "Blood group", type: "select", options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], required: true },
        { key: "contact", label: "Phone", type: "tel", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "department", label: "Department", type: "select", options: DEPARTMENTS, required: true },
        { key: "doctor", label: "Assigned doctor", required: true },
        { key: "admissionDate", label: "Admission date", type: "date", required: true },
        { key: "status", label: "Status", type: "select", options: ["Admitted", "Outpatient", "Discharged"], required: true },
      ]}
    />
  );
}
