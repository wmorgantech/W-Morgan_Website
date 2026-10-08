import { useEffect, useState } from "react";
import { fetchPublicSiteSettings } from "../lib/api";

export function usePublicSiteSettings() {
  const [settings, setSettings] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchPublicSiteSettings()
      .then((data) => {
        if (active) setSettings(data);
      })
      .catch(() => {
        if (active) setError("Public contact details could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, []);

  return { settings, error };
}
