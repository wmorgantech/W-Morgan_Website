import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Camera, Mail, MapPin, Phone, PlayCircle } from "lucide-react";

import { paths } from "../../routes/paths";
import logoMark from "../../assets/logo (2).png";
import { usePublicSiteSettings } from "../../hooks/usePublicSiteSettings";

const links = [
  { label: "Home", path: paths.home },
  { label: "About Us", path: paths.about },
  { label: "Services", path: paths.services },
  { label: "Products", path: paths.products },
  { label: "Portfolio", path: paths.portfolio },
  { label: "Career", path: paths.career },
  { label: "Contact Us", path: paths.contact },
];

const socials = [
  {
    label: "YouTube",
    icon: PlayCircle,
    href: "https://www.youtube.com/channel/UCvumCxS6lUb6y-AhPALdZLA",
  },
  {
    label: "Instagram",
    icon: Camera,
    href: "https://www.instagram.com/wmorgantechnologies/",
  },
];

const contactRow =
  "group flex items-center gap-3 text-white/65 transition-colors duration-200 hover:text-white";
const contactIcon =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-[#7be0b4] transition-colors duration-200 group-hover:border-[#7be0b4]/50";

function Footer() {
  const year = new Date().getFullYear();
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const { settings, error } = usePublicSiteSettings();
  const logo = settings.logoUrl && !logoLoadFailed ? settings.logoUrl : logoMark;

  useEffect(() => {
    setLogoLoadFailed(false);
  }, [settings.logoUrl]);

  return (
    <footer className="bg-[#0d1b14] text-white">

      <div className="relative mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-md"
              aria-label="W Morgan Technologies - Home"
            >
              <img
                src={logo}
                alt="W Morgan Technologies"
                onError={() => setLogoLoadFailed(true)}
                className="h-11 w-11 rounded-full bg-white object-contain p-0.5"
              />

              <span className="leading-none">
                <span className="block text-base font-bold tracking-tight">W MORGAN</span>
                <span className="mt-1 block font-mono text-[9px] font-medium uppercase tracking-[0.24em] text-white/45">
                  Technologies
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-[15px] leading-7 text-white/55">
              Digital products, intelligent systems and scalable technology platforms.
            </p>

            <div className="mt-6 flex gap-2">
              {socials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7be0b4] hover:bg-[#7be0b4] hover:text-[#0d1b14]"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation" className="lg:col-span-3 lg:col-start-7">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {links.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="group inline-flex items-center gap-1 text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                    <ArrowUpRight
                      size={12}
                      className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="space-y-3 text-sm lg:col-span-3">
            {settings.contactEmail && (
              <a href={`mailto:${settings.contactEmail}`} className={contactRow}>
                <span className={contactIcon}>
                  <Mail size={14} />
                </span>
                <span className="break-all">{settings.contactEmail}</span>
              </a>
            )}

            {settings.contactPhone && (
              <a
                href={`tel:${settings.contactPhone.replace(/[^\d+]/g, "")}`}
                className={contactRow}
              >
                <span className={contactIcon}>
                  <Phone size={14} />
                </span>
                <span>{settings.contactPhone}</span>
              </a>
            )}

            {settings.contactLocation && (
              <div className="group flex items-start gap-3 text-white/65">
                <span className={contactIcon}>
                  <MapPin size={14} />
                </span>
                <span className="whitespace-pre-line pt-1 leading-5">
                  {settings.contactLocation}
                </span>
              </div>
            )}
            {error && (
              <p role="status" className="text-xs text-white/60">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative mt-10 flex flex-col justify-between gap-2 border-t border-white/10 pt-5 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>© {year} W Morgan Technologies. All rights reserved.</p>

          <div className="flex gap-5">
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
