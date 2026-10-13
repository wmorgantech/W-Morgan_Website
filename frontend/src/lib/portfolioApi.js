/**
 * Single place where portfolio projects from the API are prepared for display.
 * Used by both the Home page and the Portfolio page so they always agree.
 */

/**
 * Portfolio categories. Projects have no separate category column: the category (or
 * categories) chosen for a project in Admin are saved in its `tags`, alongside its
 * technologies. A tag counts as a category when it matches a label or alias below.
 * Nothing is guessed from the title or description: a project with no category tag
 * simply shows no category label and appears under "All".
 * A filter is only offered when at least one project belongs to it.
 * Keep the labels in step with the category choices in admin/src/pages/Portfolio.jsx.
 */
export const PORTFOLIO_FILTERS = [
  {
    label: "Web Development",
    tags: ["web development", "website", "web design", "business website"],
  },
  {
    label: "E-Commerce",
    tags: ["e-commerce", "ecommerce", "e commerce", "online store"],
  },
  { label: "CRM", tags: ["crm", "customer relationship management"] },
  {
    label: "Mobile Apps",
    tags: ["mobile apps", "mobile app", "mobile", "android", "ios"],
  },
  {
    label: "UI/UX Design",
    tags: ["ui/ux design", "ui/ux", "ui", "ux", "ui ux", "product design"],
  },
  {
    label: "Custom Software",
    tags: ["custom software", "software development", "enterprise software"],
  },
  {
    label: "Cloud Solutions",
    tags: ["cloud solutions", "cloud", "devops"],
  },
];

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

// Category label for a tag, or null when the tag is a technology / free text.
function categoryForTag(tag) {
  const key = String(tag).trim().toLowerCase();
  return PORTFOLIO_FILTERS.find((filter) => filter.tags.includes(key))?.label || null;
}

/** The project's categories, in the order they were saved in Admin (first = primary). */
export function getProjectCategories(project) {
  const tags = Array.isArray(project.tags) ? project.tags : [];
  return [...new Set(tags.map(categoryForTag).filter(Boolean))];
}

function validImage(value) {
  const cleaned = cleanText(value).replace(/^["']|["']$/g, "");
  // Only real web URLs / site paths / inline images: never a local file path.
  return /^(https?:\/\/|\/(?!\/)|data:image\/)/i.test(cleaned) ? cleaned : "";
}

/**
 * Returns a link that is safe to put in an href, or null. Only http(s) URLs and site-relative
 * paths are allowed: javascript:, data:, vbscript:, file: and similar schemes, protocol-relative
 * "//host" links and anything containing backslashes or control characters are rejected.
 */
export function safeLinkUrl(value) {
  const text = cleanText(value);
  if (!text || /[\\\s\u0000-\u001f\u007f]/.test(text)) return null;
  if (text.startsWith("/")) return text.startsWith("//") ? null : text;
  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:" ? text : null;
  } catch {
    return null;
  }
}

export function normalizeProject(project, index) {
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const categories = getProjectCategories(project);

  return {
    ...project,
    number: String(index + 1).padStart(2, "0"),
    name: project.name || project.title || "Untitled Project",
    title: project.title || project.name || "Untitled Project",
    description: project.description || project.summary || "",
    summary: project.summary || "",
    tags,
    // Category tags are shown as the category label, so only the rest are technologies.
    technologies: tags.filter((tag) => !categoryForTag(tag)),
    categories,
    category: categories[0] || "",
    image: validImage(project.coverImage),
    coverImage: validImage(project.coverImage),
    // The client's logo uploaded in Admin; the card falls back to the WM badge without it.
    logo: validImage(project.clientLogo),
    url: safeLinkUrl(project.projectUrl),
  };
}

/** Same rules for product images (Admin stores whatever was typed or uploaded). */
export function validImageUrl(value) {
  return validImage(value);
}
