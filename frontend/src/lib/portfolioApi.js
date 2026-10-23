/**
 * Single place where portfolio projects from the API are prepared for display.
 * Used by both the Home page and the Portfolio page so they always agree.
 */

/**
 * Recognize legacy category tags while older project records are migrated. New
 * category assignments come from the managed PortfolioCategory relation.
 */
const legacyCategoryTags = new Map([
  ["web development", "Web Development"],
  ["website", "Web Development"],
  ["web design", "Web Development"],
  ["business website", "Web Development"],
  ["e-commerce", "E-Commerce"],
  ["ecommerce", "E-Commerce"],
  ["e commerce", "E-Commerce"],
  ["online store", "E-Commerce"],
  ["crm", "CRM"],
  ["customer relationship management", "CRM"],
  ["mobile apps", "Mobile Apps"],
  ["mobile app", "Mobile Apps"],
  ["mobile", "Mobile Apps"],
  ["android", "Mobile Apps"],
  ["ios", "Mobile Apps"],
  ["ui/ux design", "UI/UX Design"],
  ["ui/ux", "UI/UX Design"],
  ["ui", "UI/UX Design"],
  ["ux", "UI/UX Design"],
  ["ui ux", "UI/UX Design"],
  ["product design", "UI/UX Design"],
  ["custom software", "Custom Software"],
  ["software development", "Custom Software"],
  ["enterprise software", "Custom Software"],
  ["cloud solutions", "Cloud Solutions"],
  ["cloud", "Cloud Solutions"],
  ["devops", "Cloud Solutions"],
]);

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

// Category label for a tag, or null when the tag is a technology / free text.
function categoryForTag(tag) {
  const key = String(tag).trim().toLowerCase();
  return legacyCategoryTags.get(key) || null;
}

/** The project's categories, in the order they were saved in Admin (first = primary). */
export function getProjectCategories(project) {
  if (Array.isArray(project.categories) && project.categories.length) {
    return project.categories
      .map((category) =>
        typeof category === "string" ? category.trim() : cleanText(category?.name),
      )
      .filter(Boolean);
  }
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
  const assignedCategoryNames = new Set(
    (Array.isArray(project.categories) ? project.categories : [])
      .map((category) =>
        typeof category === "string" ? category.trim().toLowerCase() : cleanText(category?.name).toLowerCase(),
      )
      .filter(Boolean),
  );

  return {
    ...project,
    number: String(index + 1).padStart(2, "0"),
    name: project.name || project.title || "Untitled Project",
    title: project.title || project.name || "Untitled Project",
    description: project.description || project.summary || "",
    summary: project.summary || "",
    tags,
    // Category tags are shown as the category label, so only the rest are technologies.
    technologies: tags.filter(
      (tag) =>
        !categoryForTag(tag) &&
        !assignedCategoryNames.has(String(tag).trim().toLowerCase()),
    ),
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
