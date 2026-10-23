const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// GET responses are shared for a few seconds so that components which mount
// together (for example the footer and the Contact page, or the home page
// sections) trigger ONE request instead of repeating it. The window is short,
// so changes saved in Admin still appear on the next visit or refresh.
const GET_SHARE_WINDOW_MS = 5000;
const sharedGets = new Map();

async function request(endpoint, options = {}) {
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

    const error = new Error(
      message || `HTTP ${response.status}: ${response.statusText}`,
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

function getJson(endpoint) {
  const shared = sharedGets.get(endpoint);
  if (shared && Date.now() - shared.startedAt < GET_SHARE_WINDOW_MS) {
    return shared.promise;
  }

  const promise = request(endpoint, { cache: "no-store" });
  sharedGets.set(endpoint, { promise, startedAt: Date.now() });
  // A failed request must never be reused.
  promise.catch(() => {
    if (sharedGets.get(endpoint)?.promise === promise) {
      sharedGets.delete(endpoint);
    }
  });
  return promise;
}

// ========================================
// PUBLIC CONTENT
// ========================================

export async function fetchPublicServices() {
  return getJson("/services");
}

export async function fetchPublicPortfolio() {
  return getJson("/portfolio");
}

export async function fetchPublicPortfolioCategories() {
  return getJson("/portfolio-categories");
}

export async function fetchPublicTestimonials() {
  return getJson("/testimonials");
}

export async function fetchPublicSiteSettings() {
  return getJson("/settings/public");
}

// ========================================
// CAREERS
// ========================================

export async function fetchPublicCareerOpenings() {
  return getJson("/careers/openings");
}

export async function submitJobApplication(payload) {
  return request("/careers/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ========================================
// CONTACT
// ========================================

export async function submitContactInquiry(payload) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
