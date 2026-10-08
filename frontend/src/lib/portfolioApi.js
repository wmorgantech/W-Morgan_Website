const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function fetchFeaturedPortfolio() {
  const response = await fetch(`${API_BASE_URL}/portfolio`);
  if (!response.ok) throw new Error("Portfolio projects could not be loaded.");
  return response.json();
}

export function normalizeProject(project, index) {
  const tags = Array.isArray(project.tags) && project.tags.length ? project.tags : ["Digital Product"];
  const coverImageRaw = typeof project.coverImage === "string"
    ? project.coverImage.trim().replace(/^["']|["']$/g, "")
    : "";

  const validCover = /^(https?:\/\/|\/|data:image\/)/i.test(coverImageRaw) ? coverImageRaw : "";

  return {
    ...project,
    number: String(index + 1).padStart(2, "0"),
    category: project.clientName || tags[0] || "Selected work",
    description: project.summary || project.description || "A digital product built around a clear business need.",
    tags,
    coverImage: validCover,
  };
}
