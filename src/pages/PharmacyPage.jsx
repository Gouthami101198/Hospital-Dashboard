import React from "react";
import { Pill } from "lucide-react";
import ResourceManager from "../components/resource/ResourceManager.jsx";
import { STOCK_STATUS_MAP } from "../utils/constants.js";
import { fmtCurrency } from "../utils/helpers.js";

export default function PharmacyPage({ db, dispatch }) {
  return (
    <ResourceManager
      resource="pharmacy" dispatch={dispatch} items={db.pharmacy} idPrefix="RX"
      title="Pharmacy" subtitle="Track medicine inventory, stock levels, and expiry dates." icon={Pill}
      searchKeys={["name", "id", "category", "supplier"]}
      statusKey="status" statusMap={STOCK_STATUS_MAP}
      filters={[{ key: "status", label: "stock levels", options: ["In Stock", "Low Stock", "Out of Stock"] }]}
      columns={[
        { key: "id", label: "ID", sortable: true, render: (r) => <span className="font-data text-xs">{r.id}</span> },
        { key: "name", label: "Medicine", sortable: true },
        { key: "category", label: "Category", sortable: true },
        { key: "stock", label: "Stock", sortable: true, render: (r) => `${r.stock} ${r.unit}` },
        { key: "price", label: "Unit Price", sortable: true, render: (r) => fmtCurrency(r.price) },
        { key: "expiry", label: "Expiry", sortable: true, render: (r) => <span className="font-data text-xs">{r.expiry}</span> },
        { key: "status", label: "Status", sortable: true },
      ]}
      formFields={[
        { key: "name", label: "Medicine name", required: true },
        { key: "category", label: "Category", required: true },
        { key: "form", label: "Form", type: "select", options: ["Tablet", "Capsule", "Injection", "Inhaler", "Sachet", "Softgel"], required: true },
        { key: "stock", label: "Stock quantity", type: "number", min: 0, required: true },
        { key: "unit", label: "Unit label", required: true, placeholder: "e.g. Tablet" },
        { key: "price", label: "Unit price ($)", type: "number", min: 0, required: true },
        { key: "expiry", label: "Expiry date", type: "date", required: true },
        { key: "supplier", label: "Supplier", required: true },
        { key: "status", label: "Status", type: "select", options: ["In Stock", "Low Stock", "Out of Stock"], required: true },
      ]}
    />
  );
}
