import { paths } from "./paths";

/**
 * One source of truth for the site's navigation labels.
 * The navbar and the footer both read from here so they can never drift apart.
 */
export const primaryNav = [
  { label: "Home", path: paths.home },
  { label: "About Us", path: paths.about },
  { label: "Services", path: paths.services },
  { label: "Portfolio", path: paths.portfolio },
  { label: "Career", path: paths.career },
  { label: "Contact Us", path: paths.contact },
];

export const legalNav = [
  { label: "Privacy Policy", path: paths.privacy },
  { label: "Terms & Conditions", path: paths.terms },
];
