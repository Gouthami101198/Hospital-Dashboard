import React from "react";
import { CalendarDays } from "lucide-react";
import ResourceManager from "../components/resource/ResourceManager.jsx";
import { DEPARTMENTS, APPT_STATUS_MAP } from "../utils/constants.js";

export default function AppointmentManagement({ db, dispatch }) {
  return (
    <ResourceManager
      resource="appointments" dispatch={dispatch} items={db.appointments} idPrefix="A"
      title="Appointments" subtitle="Schedule, review, and manage patient appointments." icon={CalendarDays}
      searchKeys={["patientName", "doctorName", "department"]}
      statusKey="status" statusMap={APPT_STATUS_MAP}
      filters={[
        { key: "status", label: "statuses", options: ["Scheduled", "Completed", "Cancelled"] },
        { key: "department", label: "departments", options: DEPARTMENTS },
      ]}
      columns={[
        { key: "id", label: "ID", sortable: true, render: (r) => <span className="font-data text-xs">{r.id}</span> },
        { key: "patientName", label: "Patient", sortable: true },
        { key: "doctorName", label: "Doctor", sortable: true },
        { key: "department", label: "Department", sortable: true },
        { key: "date", label: "Date", sortable: true, render: (r) => <span className="font-data text-xs">{r.date} · {r.time}</span> },
        { key: "type", label: "Type", sortable: false },
        { key: "status", label: "Status", sortable: true },
      ]}
      formFields={[
        { key: "patientName", label: "Patient name", required: true },
        { key: "doctorName", label: "Doctor name", required: true },
        { key: "department", label: "Department", type: "select", options: DEPARTMENTS, required: true },
        { key: "date", label: "Date", type: "date", required: true },
        { key: "time", label: "Time", type: "time", required: true },
        { key: "type", label: "Type", type: "select", options: ["Consultation", "Follow-up", "Emergency", "Screening"], required: true },
        { key: "status", label: "Status", type: "select", options: ["Scheduled", "Completed", "Cancelled"], required: true },
      ]}
    />
  );
}
