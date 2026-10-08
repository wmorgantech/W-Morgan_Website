const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function fetchJson(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Response may not contain JSON.
  }

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(" ")
      : data?.message;

    throw new Error(
      message || `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  return data;
}

// ========================================
// PUBLIC CONTENT
// ========================================

export async function fetchPublicServices() {
  return fetchJson("/services");
}

export async function fetchPublicProducts() {
  return fetchJson("/products");
}

export async function fetchPublicPortfolio() {
  return fetchJson("/portfolio");
}

export async function fetchPublicTestimonials() {
  return fetchJson("/testimonials");
}

export async function fetchPublicSiteSettings() {
  return fetchJson("/settings/public");
}

// ========================================
// CAREERS
// ========================================

export async function fetchPublicCareerOpenings() {
  return fetchJson("/careers/openings");
}

export async function submitJobApplication(payload) {
  return fetchJson("/careers/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ========================================
// CONTACT
// ========================================

export async function submitContactInquiry(payload) {
  return fetchJson("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
