import React, { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, Filter, Save } from "lucide-react";
import { cx, uid, emailRe, phoneRe } from "../../utils/helpers.js";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import SortHeader from "../common/SortHeader.jsx";
import Pagination from "../common/Pagination.jsx";
import Modal from "../common/Modal.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import EmptyState from "../common/EmptyState.jsx";
import Spinner from "../common/Spinner.jsx";
import Button from "../common/Button.jsx";
import Field from "../common/Field.jsx";
import TextInput from "../common/TextInput.jsx";
import SelectInput from "../common/SelectInput.jsx";

/**
 * Generic CRUD resource manager — drives Patients, Doctors, Pharmacy, Billing
 * and Appointments screens from a single reusable component + per-module config.
 */
export default function ResourceManager({
  resource, dispatch, items, idPrefix, title, subtitle, icon: Icon,
  columns, formFields, searchKeys, filters = [], statusMap, statusKey, pageSize = 8,
}) {
  const t = useTheme();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [sortKey, setSortKey] = useState(columns[0].key);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // 'add' | 'edit' | null
  const [editing, setEditing] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const tm = setTimeout(() => setLoading(false), 420); return () => clearTimeout(tm); }, []);
  useEffect(() => { setPage(1); }, [search, filterValues, resource]);

  const filtered = useMemo(() => {
    let rows = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q)));
    }
    Object.entries(filterValues).forEach(([k, v]) => { if (v) rows = rows.filter((r) => String(r[k]) === v); });
    rows = [...rows].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [items, search, filterValues, sortKey, sortDir]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openAdd = () => {
    const init = {};
    formFields.forEach((f) => { init[f.key] = f.type === "select" ? f.options[0] : ""; });
    setFormValues(init); setFormErrors({}); setEditing(null); setModal("add");
  };
  const openEdit = (row) => { setFormValues(row); setFormErrors({}); setEditing(row); setModal("edit"); };
  const closeModal = () => setModal(null);

  const validate = () => {
    const errs = {};
    formFields.forEach((f) => {
      const v = formValues[f.key];
      if (f.required && (v === undefined || v === "" || v === null)) errs[f.key] = "This field is required.";
      else if (f.type === "email" && v && !emailRe.test(v)) errs[f.key] = "Enter a valid email address.";
      else if (f.type === "tel" && v && !phoneRe.test(v)) errs[f.key] = "Enter a valid phone number.";
      else if (f.type === "number" && v !== "" && (isNaN(v) || Number(v) < (f.min ?? -Infinity))) errs[f.key] = `Enter a number ${f.min !== undefined ? `≥ ${f.min}` : ""}.`;
    });
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (modal === "add") {
      const payload = { ...formValues, id: uid(idPrefix) };
      dispatch({ type: "ADD", resource, payload });
      toast.success(`${title.slice(0, -1)} added successfully.`);
    } else {
      dispatch({ type: "UPDATE", resource, payload: { ...editing, ...formValues } });
      toast.success(`${title.slice(0, -1)} updated successfully.`);
    }
    closeModal();
  };

  const confirmDelete = () => {
    const row = items.find((i) => i.id === deleteId);
    dispatch({ type: "DELETE", resource, payload: deleteId });
    toast.info(`${row?.name || row?.id || "Record"} was deleted.`);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className={cx("font-display font-semibold text-xl", t.text)}>{title}</h2>
          <p className={cx("font-body text-sm", t.textMuted)}>{subtitle}</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add {title.slice(0, -1)}</Button>
      </div>

      <div className={cx("rounded-2xl border", t.surface, t.border)}>
        <div className={cx("flex flex-col md:flex-row md:items-center gap-3 p-4 border-b", t.border)}>
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className={cx("absolute left-3 top-1/2 -translate-y-1/2", t.textSubtle)} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}…`}
              className={cx("w-full pl-9 pr-3 py-2 rounded-lg border text-sm font-body outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500", t.input)}
            />
          </div>
          {filters.map((f) => (
            <select
              key={f.key}
              value={filterValues[f.key] || ""}
              onChange={(e) => setFilterValues((v) => ({ ...v, [f.key]: e.target.value }))}
              className={cx("rounded-lg border px-3 py-2 text-sm font-body outline-none", t.input)}
            >
              <option value="">All {f.label}</option>
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
          <span className={cx("hidden md:flex items-center gap-1 text-xs font-body ml-auto", t.textSubtle)}>
            <Filter size={12} /> {filtered.length} results
          </span>
        </div>

        {loading ? (
          <Spinner label={`Loading ${title.toLowerCase()}`} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Icon} title="No records found" message="Try adjusting your search or filters, or add a new record to get started." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={cx("border-b", t.border)}>
                    {columns.map((c) => (
                      <th key={c.key} className="text-left px-4 py-3 whitespace-nowrap">
                        {c.sortable ? (
                          <SortHeader
                            label={c.label}
                            active={sortKey === c.key}
                            dir={sortDir}
                            onClick={() => { setSortKey(c.key); setSortDir(sortKey === c.key && sortDir === "asc" ? "desc" : "asc"); }}
                          />
                        ) : (
                          <span className={cx("font-body font-semibold text-xs uppercase tracking-wide", t.textMuted)}>{c.label}</span>
                        )}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right">
                      <span className={cx("font-body font-semibold text-xs uppercase tracking-wide", t.textMuted)}>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row) => (
                    <tr key={row.id} className={cx("border-b last:border-0 transition", t.border, t.hover)}>
                      {columns.map((c) => (
                        <td key={c.key} className={cx("px-4 py-3 whitespace-nowrap font-body", t.text)}>
                          {c.key === statusKey ? <StatusBadge value={row[c.key]} map={statusMap} /> : c.render ? c.render(row) : row[c.key]}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(row)} className={cx("p-1.5 rounded-lg", t.hover, t.textMuted)} title="Edit">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 pb-4">
              <Pagination page={page} pages={pages} onChange={setPage} total={filtered.length} pageSize={pageSize} />
            </div>
          </>
        )}
      </div>

      <Modal open={!!modal} onClose={closeModal} title={modal === "add" ? `Add ${title.slice(0, -1)}` : `Edit ${title.slice(0, -1)}`} wide>
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {formFields.map((f) => (
            <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
              <Field label={f.label} error={formErrors[f.key]} required={f.required}>
                {f.type === "select" ? (
                  <SelectInput error={formErrors[f.key]} value={formValues[f.key] ?? ""} onChange={(e) => setFormValues((v) => ({ ...v, [f.key]: e.target.value }))}>
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </SelectInput>
                ) : (
                  <TextInput
                    error={formErrors[f.key]}
                    type={f.type || "text"}
                    value={formValues[f.key] ?? ""}
                    onChange={(e) => setFormValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                  />
                )}
              </Field>
            </div>
          ))}
          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={closeModal}>Cancel</Button>
            <Button type="submit"><Save size={15} /> {modal === "add" ? "Add record" : "Save changes"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        itemLabel={items.find((i) => i.id === deleteId)?.name || items.find((i) => i.id === deleteId)?.id}
      />
    </div>
  );
}
