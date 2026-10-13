import { paths } from "./paths";

/**
 * One source of truth for the site's navigation labels.
 * The navbar and the footer both read from here so they can never drift apart.
 */
export const primaryNav = [
  { label: "Home", path: paths.home },
  { label: "About", path: paths.about },
  { label: "Services", path: paths.services },
  { label: "Products", path: paths.products },
  { label: "Portfolio", path: paths.portfolio },
  { label: "Our Team", path: paths.team },
  { label: "Careers", path: paths.career },
  { label: "Contact", path: paths.contact },
];

export const legalNav = [
  { label: "Privacy Policy", path: paths.privacy },
  { label: "Terms & Conditions", path: paths.terms },
];
