import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import ImageUploadField from "../components/ImageUploadField";
import api, { getApiError } from "../lib/api";

const settingFields = [
  ["contactEmail", "Email address", "email"],
  ["contactPhone", "Phone number", "tel"],
  ["contactLocation", "Location", "textarea"],
  ["workingHours", "Working hours", "text"],
  ["aboutVideoUrl", "Who We Are video URL", "url"],
];

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/admin/settings")
      .then(({ data }) => setSettings(data))
      .catch((requestError) => setError(getApiError(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const update = (event) => {
    setSaved(false);
    setSettings((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const updateLogo = (logoUrl) => {
    setSaved(false);
    setSettings((current) => ({ ...current, logoUrl }));
  };

  const updateAboutImage = (aboutImageUrl) => {
    setSaved(false);
    setSettings((current) => ({ ...current, aboutImageUrl }));
  };

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const { data } = await api.put("/admin/settings", settings);
      setSettings(data);
      setSaved(true);
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <section className="content-page">
        <header className="content-page-header">
          <div>
            <p className="content-eyebrow">PUBLIC WEBSITE</p>
            <h1>Contact Details</h1>
            <p className="content-description">Contact information stored for the public website.</p>
          </div>
        </header>
        {error && <p className="content-error" role="alert">{error}</p>}
        <form className="content-table-frame content-form" onSubmit={save}>
          {settingFields.map(([name, label, type]) => (
            <label className={`content-field ${type === "textarea" ? "wide" : ""}`} key={name}>
              <span>{label}</span>
              {type === "textarea" ? (
                <textarea name={name} rows={3} value={settings[name] || ""} onChange={update} disabled={loading || saving} />
              ) : (
                <input name={name} type={type} value={settings[name] || ""} onChange={update} disabled={loading || saving} />
              )}
            </label>
          ))}
          <div className="content-field wide">
            <span>Site logo</span>
            <ImageUploadField
              id="settings-logo"
              label="site logo"
              value={settings.logoUrl || ""}
              onChange={updateLogo}
              disabled={loading || saving}
            />
          </div>
          <div className="content-field wide">
            <span>Who We Are image</span>
            <ImageUploadField
              id="settings-about-image"
              label="Who We Are image"
              value={settings.aboutImageUrl || ""}
              onChange={updateAboutImage}
              disabled={loading || saving}
            />
          </div>
          <p className="content-count wide">
            For video, use a YouTube or Vimeo link, or a direct MP4, WebM, or Ogg URL. Leave blank to show only the image.
          </p>
          <footer className="content-form-actions">
            {loading && <span className="content-count">Loading settings…</span>}
            {saved && <span role="status" className="content-count">Saved</span>}
            <button className="content-primary-button" type="submit" disabled={loading || saving}>{saving ? "Saving…" : "Save changes"}</button>
          </footer>
        </form>
      </section>
    </AdminLayout>
  );
}
