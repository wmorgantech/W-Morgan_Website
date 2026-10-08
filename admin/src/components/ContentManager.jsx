import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ExternalLink, ImageOff, Inbox, Pencil, Plus, Search, SearchX, Trash2, X } from "lucide-react";
import api, { getApiError } from "../lib/api";
import ImageUploadField from "./ImageUploadField";

/* ---------------------------------------------------------------
   Helpers
---------------------------------------------------------------- */

function makeDraft(fields, record = {}) {
  return Object.fromEntries(fields.map(({ name, type }) => {
    const value = record[name];
    if (type === "tags") return [name, Array.isArray(value) ? value.join(", ") : ""];
    if (type === "checkbox") return [name, Boolean(value)];
    return [name, value ?? ""];
  }));
}

function makePayload(fields, draft) {
  return Object.fromEntries(fields.map(({ name, type }) => {
    const value = draft[name];
    if (type === "tags") return [name, value.split(",").map((tag) => tag.trim()).filter(Boolean)];
    if (type === "number") return [name, value === "" ? 0 : Number(value)];
    return [name, typeof value === "string" ? value.trim() : value];
  }));
}

function titleCase(value) {
  return String(value).toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

function displayValue(value, key, type) {
  if (type === "date") return value ? formatDate(value) : "—";
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (typeof value === "boolean") {
    if (key === "featured") return value ? "Featured" : "Not featured";
    return value ? "Active" : "Inactive";
  }
  if (typeof value === "string" && key === "status") return titleCase(value);
  if (value === 0) return "0";
  return value || "—";
}

function isValidUrlOrPath(value) {
  if (value.startsWith("/") && !value.startsWith("//") && !/\s/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function humanizeOption(option) {
  const value = typeof option === "string" ? option : option.value;
  const label = typeof option === "string" ? null : option.label;
  return { value, label: label || titleCase(value) };
}

const STATUS_KEYS = ["status", "isActive", "featured"];

function statusClass(value) {
  return String(value).toLowerCase().replaceAll("_", "-");
}

/* ---------------------------------------------------------------
   Small presentational pieces
---------------------------------------------------------------- */

function Thumb({ src, alt = "" }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <span className="content-thumb content-thumb-empty" aria-hidden="true"><ImageOff size={14} /></span>;
  }
  return <img className="content-thumb" src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

function DetailValue({ item, record }) {
  const raw = record[item.key];
  const empty = raw === undefined || raw === null || raw === "" || (Array.isArray(raw) && raw.length === 0);
  if (empty) return <span className="detail-muted">Not provided</span>;

  if (item.format) return <span className="detail-break">{item.format(raw, record)}</span>;
  if (item.type === "link" || item.type === "url") {
    return isHttpUrl(raw)
      ? <a className="detail-link" href={raw} target="_blank" rel="noopener noreferrer">{raw}<ExternalLink size={12} /></a>
      : <span className="detail-break">{raw}</span>;
  }
  if (item.type === "email") return <a className="detail-link" href={`mailto:${raw}`}>{raw}</a>;
  if (item.type === "tags" || Array.isArray(raw)) {
    return <span className="detail-tags">{raw.map((tag) => <b key={tag}>{tag}</b>)}</span>;
  }
  if (item.type === "date") return formatDate(raw);
  if (item.type === "long") return <span className="detail-long">{raw}</span>;
  if (STATUS_KEYS.includes(item.key)) {
    return <span className={`content-status ${statusClass(raw)}`}>{displayValue(raw, item.key)}</span>;
  }
  return <span className="detail-break">{displayValue(raw, item.key, item.type)}</span>;
}

/* ---------------------------------------------------------------
   Component
---------------------------------------------------------------- */

export default function ContentManager({
  title,
  description,
  resource,
  fields,
  columns,
  emptyMessage,
  detailFields,
  itemName,
  allowCreate = true,
  allowEdit = true,
  allowDelete = true,
}) {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [draft, setDraft] = useState(() => makeDraft(fields));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const dialogRef = useRef(null);
  const drawerRef = useRef(null);
  const confirmRef = useRef(null);
  const openerRef = useRef(null);
  const savingRef = useRef(false);

  const endpoint = resource.replace(/\/manage$/, "");
  const singular = itemName || (title.endsWith("ies") ? `${title.slice(0, -3)}y` : title.replace(/s$/, ""));
  const primaryKey = columns[0].key;

  /* ---------- data ---------- */

  useEffect(() => {
    let active = true;
    api.get(resource)
      .then(({ data }) => {
        if (active) setRecords(Array.isArray(data) ? data : []);
      })
      .catch((requestError) => {
        if (active) setError(getApiError(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [resource]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  /* ---------- overlays (form / drawer / confirm) ---------- */

  const closeForm = useCallback(() => {
    if (savingRef.current) return;
    setFormOpen(false);
    setEditing(null);
    setDraft(makeDraft(fields));
  }, [fields]);

  const closeDrawer = useCallback(() => setViewing(null), []);
  const closeConfirm = useCallback(() => {
    if (!deleting) setConfirming(null);
  }, [deleting]);

  const overlayOpen = formOpen || Boolean(viewing) || Boolean(confirming);

  useEffect(() => {
    if (!overlayOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusableSelector = 'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]';
    const container = () => confirmRef.current || dialogRef.current || drawerRef.current;
    container()?.querySelector(focusableSelector)?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (confirming) closeConfirm();
        else if (formOpen) closeForm();
        else closeDrawer();
        return;
      }
      if (event.key !== "Tab") return;

      const elements = [...(container()?.querySelectorAll(focusableSelector) || [])];
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [overlayOpen, formOpen, confirming, closeConfirm, closeForm, closeDrawer]);

  // Return focus to whatever opened the overlay once everything is closed.
  useEffect(() => {
    if (overlayOpen) return;
    if (openerRef.current?.isConnected) openerRef.current.focus();
    openerRef.current = null;
  }, [overlayOpen]);

  /* ---------- filtering ---------- */

  const filterKey = useMemo(
    () => columns.find((column) => STATUS_KEYS.includes(column.key))?.key,
    [columns],
  );

  const filterOptions = useMemo(() => {
    if (!filterKey) return [];
    const counts = new Map();
    records.forEach((record) => {
      const value = record[filterKey];
      counts.set(value, (counts.get(value) || 0) + 1);
    });
    return [...counts.entries()].map(([value, count]) => ({
      value: String(value),
      label: displayValue(value, filterKey),
      count,
    }));
  }, [filterKey, records]);

  const filteredRecords = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return records.filter((record) => {
      if (filterKey && filter !== "all" && String(record[filterKey]) !== filter) return false;
      if (!normalizedSearch) return true;
      return columns.some((column) => {
        const raw = column.format ? column.format(record[column.key], record) : displayValue(record[column.key], column.key, column.type);
        return String(raw).toLowerCase().includes(normalizedSearch);
      });
    });
  }, [columns, filter, filterKey, records, search]);

  /* ---------- actions ---------- */

  const openForm = (record = null, event = null) => {
    openerRef.current = event?.currentTarget || openerRef.current;
    setViewing(null);
    setEditing(record);
    setDraft(makeDraft(fields, record || {}));
    setFormOpen(true);
    setError("");
  };

  const openDrawer = (record, event) => {
    openerRef.current = event.currentTarget;
    setViewing(record);
  };

  const saveRecord = async (event) => {
    event.preventDefault();
    const payload = makePayload(fields, draft);
    const invalidUrl = fields.find((field) =>
      field.type === "url" && payload[field.name] && !isValidUrlOrPath(payload[field.name])
    );
    if (invalidUrl) {
      setError(`${invalidUrl.label} must be an HTTP(S) URL or a site-relative path.`);
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setError("");
    try {
      const { data } = editing
        ? await api.patch(`${endpoint}/${editing.id}`, payload)
        : await api.post(endpoint, payload);

      setRecords((current) => editing
        ? current.map((record) => record.id === editing.id ? data : record)
        : [data, ...current]
      );
      setToast(editing ? `${singular} updated.` : `${singular} created.`);
      savingRef.current = false;
      setFormOpen(false);
      setEditing(null);
      setDraft(makeDraft(fields));
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const askDelete = (record, event) => {
    openerRef.current = event?.currentTarget || openerRef.current;
    setError("");
    setConfirming(record);
  };

  const confirmDelete = async () => {
    if (!confirming) return;
    setDeleting(true);
    setError("");
    try {
      await api.delete(`${endpoint}/${confirming.id}`);
      setRecords((current) => current.filter((item) => item.id !== confirming.id));
      setToast(`${singular} deleted.`);
      setConfirming(null);
      setViewing(null);
    } catch (requestError) {
      setError(getApiError(requestError));
      setConfirming(null);
    } finally {
      setDeleting(false);
    }
  };

  /* ---------- derived view data ---------- */

  const hasRowActions = allowEdit || allowDelete;
  const colSpan = columns.length + (hasRowActions ? 1 : 0);

  const detailList = useMemo(() => {
    if (detailFields) return detailFields;
    const seen = new Set([primaryKey]);
    const list = [];
    columns.slice(1).forEach((column) => {
      seen.add(column.key);
      list.push({ key: column.key, label: column.label, type: column.type });
    });
    fields.forEach((field) => {
      if (seen.has(field.name)) return;
      seen.add(field.name);
      const type = field.type === "textarea" ? "long" : field.type === "checkbox" ? undefined : field.type;
      list.push({ key: field.name, label: field.label, type });
    });
    return list;
  }, [columns, detailFields, fields, primaryKey]);

  const cover = viewing && typeof viewing.coverImage === "string" ? viewing.coverImage : "";
  const statusItem = viewing && filterKey ? viewing[filterKey] : undefined;
  const confirmName = confirming ? confirming[primaryKey] : "";

  /* ---------- render ---------- */

  return (
    <section className="content-page">
      <header className="content-page-header">
        <div>
          <p className="content-eyebrow">PUBLIC WEBSITE</p>
          <h1>{title}</h1>
          <p className="content-description">{description}</p>
        </div>
        {allowCreate && (
          <button type="button" className="content-primary-button" onClick={(event) => openForm(null, event)}>
            <Plus size={17} /> Add {singular}
          </button>
        )}
      </header>

      <div className="content-toolbar">
        <label className="content-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${title.toLowerCase()}`}
            aria-label={`Search ${title.toLowerCase()}`}
          />
        </label>

        {filterOptions.length > 1 && (
          <div className="content-filters" role="group" aria-label={`Filter ${title.toLowerCase()}`}>
            <button type="button" className={filter === "all" ? "active" : ""} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
              All <small>{records.length}</small>
            </button>
            {filterOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                className={filter === option.value ? "active" : ""}
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
              >
                {option.label} <small>{option.count}</small>
              </button>
            ))}
          </div>
        )}

        <span className="content-count" aria-live="polite">
          {loading ? "Loading" : `${filteredRecords.length} ${filteredRecords.length === 1 ? "record" : "records"}`}
        </span>
      </div>

      {error && !formOpen && <p className="content-error" role="alert">{error}</p>}

      <div className="content-table-frame">
        <div className="content-table-scroll">
          <table className="content-table">
            <thead>
              <tr>
                {columns.map((column) => <th key={column.key}>{column.label}</th>)}
                {hasRowActions && <th className="content-actions-heading">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="content-row"
                  tabIndex={0}
                  onClick={(event) => openDrawer(record, event)}
                  onKeyDown={(event) => {
                    if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      openDrawer(record, event);
                    }
                  }}
                  aria-label={`View ${record[primaryKey]}`}
                >
                  {columns.map((column) => {
                    const value = record[column.key];
                    const isPrimary = column.key === primaryKey;
                    let content;

                    if (column.type === "image") {
                      content = <Thumb src={value} />;
                    } else if (column.format) {
                      content = <span className={isPrimary ? "content-primary-value" : ""}>{column.format(value, record)}</span>;
                    } else if (STATUS_KEYS.includes(column.key)) {
                      content = <span className={`content-status ${statusClass(value)}`}>{displayValue(value, column.key)}</span>;
                    } else {
                      content = <span className={isPrimary ? "content-primary-value" : ""}>{displayValue(value, column.key, column.type)}</span>;
                    }

                    return <td key={column.key} data-label={column.label}>{content}</td>;
                  })}
                  {hasRowActions && (
                    <td className="content-row-actions" data-label="Actions" onClick={(event) => event.stopPropagation()}>
                      {allowEdit && (
                        <button type="button" className="content-icon-button" onClick={(event) => openForm(record, event)} aria-label={`Edit ${record[primaryKey]}`} title="Edit">
                          <Pencil size={16} />
                        </button>
                      )}
                      {allowDelete && (
                        <button type="button" className="content-icon-button danger" onClick={(event) => askDelete(record, event)} aria-label={`Delete ${record[primaryKey]}`} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}

              {loading && [0, 1, 2, 3].map((row) => (
                <tr key={`skeleton-${row}`} className="content-skeleton-row" aria-hidden="true">
                  {Array.from({ length: colSpan }, (_, cell) => (
                    <td key={cell}><span className="content-skeleton" style={{ width: `${cell === 0 ? 70 : 40 + ((cell * 17 + row * 11) % 45)}%` }} /></td>
                  ))}
                </tr>
              ))}

              {!loading && filteredRecords.length === 0 && (
                <tr>
                  <td className="content-empty" colSpan={colSpan}>
                    <span className="empty-icon" aria-hidden="true">
                      {search || filter !== "all" ? <SearchX size={20} /> : <Inbox size={20} />}
                    </span>
                    <span className="empty-text">
                      {search || filter !== "all" ? "No matching records." : emptyMessage}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- Detail drawer ---------------- */}
      {viewing && !formOpen && !confirming && (
        <div className="content-drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeDrawer()}>
          <aside ref={drawerRef} className="content-drawer" role="dialog" aria-modal="true" aria-labelledby="content-drawer-title">
            <header className="content-drawer-header">
              <div>
                <p className="content-eyebrow">{singular.toUpperCase()} DETAILS</p>
                <h2 id="content-drawer-title">{String(viewing[primaryKey] ?? "Untitled")}</h2>
                {statusItem !== undefined && (
                  <span className={`content-status ${statusClass(statusItem)}`}>{displayValue(statusItem, filterKey)}</span>
                )}
              </div>
              <button type="button" className="content-icon-button" onClick={closeDrawer} aria-label="Close details"><X size={19} /></button>
            </header>

            <div className="content-drawer-body">
              {cover && (
                <div className="drawer-cover"><Thumb src={cover} alt={`${viewing[primaryKey]} cover`} /></div>
              )}
              <dl className="detail-list">
                {detailList.filter((item) => item.key !== filterKey && item.key !== "coverImage").map((item) => (
                  <div className={`detail-row ${item.type === "long" ? "wide" : ""}`} key={item.key}>
                    <dt>{item.label}</dt>
                    <dd><DetailValue item={item} record={viewing} /></dd>
                  </div>
                ))}
              </dl>
            </div>

            {(allowEdit || allowDelete) && (
              <footer className="content-drawer-actions">
                {allowDelete && (
                  <button type="button" className="content-danger-button" onClick={(event) => askDelete(viewing, event)}>
                    <Trash2 size={15} /> Delete
                  </button>
                )}
                {allowEdit && (
                  <button type="button" className="content-primary-button" onClick={(event) => openForm(viewing, event)}>
                    <Pencil size={15} /> Edit {singular}
                  </button>
                )}
              </footer>
            )}
          </aside>
        </div>
      )}

      {/* ---------------- Confirm delete ---------------- */}
      {confirming && (
        <div className="content-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeConfirm()}>
          <section ref={confirmRef} className="content-confirm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-text">
            <span className="confirm-icon"><Trash2 size={20} /></span>
            <h2 id="confirm-title">Delete {singular.toLowerCase()}?</h2>
            <p id="confirm-text">
              “{String(confirmName)}” will be permanently removed{title === "Portfolio" ? " from the public portfolio" : ""}. This cannot be undone.
            </p>
            <footer>
              <button type="button" className="content-secondary-button" onClick={closeConfirm} disabled={deleting}>Cancel</button>
              <button type="button" className="content-danger-button solid" onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Delete permanently"}
              </button>
            </footer>
          </section>
        </div>
      )}

      {/* ---------------- Add / edit form ---------------- */}
      {formOpen && (
        <div className="content-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeForm()}>
          <section ref={dialogRef} className="content-modal" role="dialog" aria-modal="true" aria-labelledby="content-modal-title">
            <header className="content-modal-header">
              <div>
                <p className="content-eyebrow">{editing ? "EDIT RECORD" : "NEW RECORD"}</p>
                <h2 id="content-modal-title">{editing ? `Edit ${singular}` : `Add ${singular}`}</h2>
              </div>
              <button type="button" className="content-icon-button" onClick={closeForm} aria-label="Close dialog" disabled={saving}><X size={19} /></button>
            </header>
            <form className="content-form" onSubmit={saveRecord}>
              {fields.map((field) => {
                const id = `content-field-${field.name}`;
                const setValue = (value) => setDraft((current) => ({ ...current, [field.name]: value }));
                if (field.type === "image") {
                  return (
                    <div key={field.name} className="content-field wide">
                      <span>{field.label}{field.required && <b> *</b>}</span>
                      <ImageUploadField
                        id={id}
                        label={field.label}
                        value={draft[field.name]}
                        onChange={setValue}
                        disabled={saving}
                      />
                    </div>
                  );
                }
                const control = field.type === "textarea" ? (
                  <textarea id={id} rows={4} required={field.required} value={draft[field.name]} onChange={(event) => setValue(event.target.value)} />
                ) : field.type === "select" ? (
                  <select id={id} required={field.required} value={draft[field.name]} onChange={(event) => setValue(event.target.value)}>
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options.map((option) => {
                      const { value, label } = humanizeOption(option);
                      return <option key={value} value={value}>{label}</option>;
                    })}
                  </select>
                ) : field.type === "checkbox" ? (
                  <label className="content-checkbox" htmlFor={id}>
                    <input id={id} type="checkbox" checked={draft[field.name]} onChange={(event) => setValue(event.target.checked)} />
                    {field.checkboxLabel || (field.name === "featured" ? "Featured on public website" : "Active on public website")}
                  </label>
                ) : (
                  <input
                    id={id}
                    type={field.type === "number" ? "number" : field.type === "email" ? "email" : "text"}
                    inputMode={field.type === "url" ? "url" : undefined}
                    autoCapitalize={field.type === "url" ? "none" : undefined}
                    autoCorrect={field.type === "url" ? "off" : undefined}
                    min={field.type === "number" ? "0" : undefined}
                    step={field.type === "number" ? "1" : undefined}
                    required={field.required}
                    value={draft[field.name]}
                    placeholder={field.type === "tags" ? "Separate items with commas" : field.type === "url" ? "https://example.com or /path" : ""}
                    onChange={(event) => setValue(event.target.value)}
                    aria-describedby={field.type === "url" ? `${id}-hint` : undefined}
                  />
                );

                if (field.type === "checkbox") {
                  return (
                    <div key={field.name} className="content-field">
                      <span>{field.label}{field.required && <b> *</b>}</span>
                      {control}
                    </div>
                  );
                }

                return (
                  <label key={field.name} htmlFor={id} className={`content-field ${field.type === "textarea" ? "wide" : ""}`}>
                    <span>{field.label}{field.required && <b> *</b>}</span>
                    {control}
                    {field.type === "url" && <small id={`${id}-hint`}>Enter an HTTP(S) URL or a path beginning with /.</small>}
                  </label>
                );
              })}
              {error && <p className="content-error wide" role="alert">{error}</p>}
              <footer className="content-form-actions">
                <button type="button" className="content-secondary-button" onClick={closeForm} disabled={saving}>Cancel</button>
                <button type="submit" className="content-primary-button" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
              </footer>
            </form>
          </section>
        </div>
      )}

      <div className="content-toast-region" aria-live="polite" role="status">
        {toast && <div className="content-toast"><Check size={15} /> {toast}</div>}
      </div>
    </section>
  );
}
