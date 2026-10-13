import { useEffect } from "react";

export const SITE_NAME = "W Morgan Technologies";
// Confirmed production domain. Canonical and sharing URLs always use it, whatever host
// the page is being viewed on (localhost, a preview link or a www alias).
export const SITE_URL = "https://wmorgantech.com";
const SOCIAL_IMAGE_PATH = "/og-image.jpg";

function setTag(selector, create, content) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

const metaByName = (name, content) =>
  setTag(
    `meta[name="${name}"]`,
    () => Object.assign(document.createElement("meta"), { name }),
    content,
  );

const metaByProperty = (property, content) =>
  setTag(
    `meta[property="${property}"]`,
    () => {
      const element = document.createElement("meta");
      element.setAttribute("property", property);
      return element;
    },
    content,
  );

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

/**
 * Sets the page title, meta description, social-sharing tags, canonical URL and
 * robots directive for the current route. Pass `noindex` for pages that should
 * not appear in search results (for example the 404 page).
 */
export function usePageMeta({ title, fullTitle: fullTitleOverride, description, noindex = false }) {
  useEffect(() => {
    const fullTitle = fullTitleOverride || (title ? `${title} | ${SITE_NAME}` : SITE_NAME);
    const origin = SITE_URL;
    const url = `${origin}${window.location.pathname}`;

    document.title = fullTitle;
    metaByName("description", description);
    metaByName("robots", noindex ? "noindex, nofollow" : "index, follow");
    metaByProperty("og:title", fullTitle);
    metaByProperty("og:description", description);
    metaByProperty("og:url", url);
    metaByProperty("og:image", `${origin}${SOCIAL_IMAGE_PATH}`);
    metaByName("twitter:title", fullTitle);
    metaByName("twitter:description", description);
    metaByName("twitter:image", `${origin}${SOCIAL_IMAGE_PATH}`);
    setCanonical(url);
  }, [title, fullTitleOverride, description, noindex]);
}
