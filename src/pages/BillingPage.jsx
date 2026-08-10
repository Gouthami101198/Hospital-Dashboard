import React from "react";
import { Receipt, Wallet, Clock, AlertTriangle } from "lucide-react";
import ResourceManager from "../components/resource/ResourceManager.jsx";
import StatCard from "../components/common/StatCard.jsx";
import { INVOICE_STATUS_MAP } from "../utils/constants.js";
import { fmtCurrency } from "../utils/helpers.js";

export default function BillingPage({ db, dispatch }) {
  const totalRevenue = db.invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + Number(i.amount), 0);
  const pending = db.invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + Number(i.amount), 0);
  const overdue = db.invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + Number(i.amount), 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Revenue Collected" value={fmtCurrency(totalRevenue)} icon={Wallet} accent="emerald" delta="Paid invoices" />
        <StatCard label="Pending" value={fmtCurrency(pending)} icon={Clock} accent="amber" delta="Awaiting payment" />
        <StatCard label="Overdue" value={fmtCurrency(overdue)} icon={AlertTriangle} accent="rose" delta="Needs follow-up" />
      </div>
      <ResourceManager
        resource="invoices" dispatch={dispatch} items={db.invoices} idPrefix="INV"
        title="Invoices" subtitle="Generate, track, and reconcile patient billing." icon={Receipt}
        searchKeys={["patientName", "id", "method"]}
        statusKey="status" statusMap={INVOICE_STATUS_MAP}
        filters={[
          { key: "status", label: "statuses", options: ["Paid", "Pending", "Overdue"] },
          { key: "method", label: "methods", options: ["Card", "Insurance", "Cash", "Bank Transfer"] },
        ]}
        columns={[
          { key: "id", label: "Invoice", sortable: true, render: (r) => <span className="font-data text-xs">{r.id}</span> },
          { key: "patientName", label: "Patient", sortable: true },
          { key: "date", label: "Date", sortable: true, render: (r) => <span className="font-data text-xs">{r.date}</span> },
          { key: "items", label: "Items", sortable: true },
          { key: "amount", label: "Amount", sortable: true, render: (r) => <span className="font-data text-xs font-medium">{fmtCurrency(r.amount)}</span> },
          { key: "method", label: "Method", sortable: false },
          { key: "status", label: "Status", sortable: true },
        ]}
        formFields={[
          { key: "patientName", label: "Patient name", required: true },
          { key: "date", label: "Date", type: "date", required: true },
          { key: "items", label: "Number of items", type: "number", min: 1, required: true },
          { key: "amount", label: "Amount ($)", type: "number", min: 0, required: true },
          { key: "method", label: "Payment method", type: "select", options: ["Card", "Insurance", "Cash", "Bank Transfer"], required: true },
          { key: "status", label: "Status", type: "select", options: ["Paid", "Pending", "Overdue"], required: true },
        ]}
      />
    </div>
  );
}
