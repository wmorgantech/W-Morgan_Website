import { useEffect, useState } from "react";
import api, { getApiError } from "../lib/api";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export default function ImageUploadField({
  id,
  label,
  value,
  onChange,
  disabled = false,
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const chooseFile = (event) => {
    const selected = event.target.files?.[0];
    event.target.value = "";
    setError("");
    if (!selected) return;
    if (!IMAGE_TYPES.includes(selected.type)) {
      setFile(null);
      setError("Choose a JPG, PNG, WEBP, or SVG image.");
      return;
    }
    if (selected.size > MAX_IMAGE_SIZE) {
      setFile(null);
      setError("Image files must be 5 MB or smaller.");
      return;
    }
    setFile(selected);
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
      setFile(null);
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-field">
      <label className="image-upload-picker" htmlFor={id}>
        Choose image
        <input
          id={id}
          type="file"
          accept={IMAGE_TYPES.join(",")}
          onChange={chooseFile}
          disabled={disabled || uploading}
          aria-label={`Choose ${label}`}
        />
      </label>
      {(previewUrl || value) && (
        <img
          className="image-upload-preview"
          src={previewUrl || value}
          alt={`${label} preview`}
        />
      )}
      {file && (
        <div className="image-upload-actions">
          <span className="content-count">{file.name}</span>
          <button
            className="content-primary-button"
            type="button"
            onClick={upload}
            disabled={disabled || uploading}
          >
            {uploading ? "Uploading…" : "Upload image"}
          </button>
          <button
            className="content-secondary-button"
            type="button"
            onClick={() => setFile(null)}
            disabled={disabled || uploading}
          >
            Cancel
          </button>
        </div>
      )}
      {error && <small className="image-upload-error" role="alert">{error}</small>}
    </div>
  );
}
