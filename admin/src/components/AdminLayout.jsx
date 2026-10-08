import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/products": "Product Suite",
  "/services": "Services",
  "/portfolio": "Portfolio",
  "/testimonials": "Testimonials",
  "/careers": "Careers",
  "/contact": "Contact Inquiries",
  "/settings": "Settings",
};

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem("adminProfile") || "{}");
  } catch {
    return {};
  }
}

export default function AdminLayout({ children }) {
  const profile = getProfile();
  const { pathname } = useLocation();
  const pageTitle = pageTitles[pathname];
  const initials = profile.name?.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "A";

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-workspace">
        <header className="admin-navbar">
          <div>
            <span className="admin-navbar-eyebrow">WMORGAN TECHNOLOGIES</span>
            <strong>
              Admin workspace
              {pageTitle && (
                <>
                  <span className="crumb-sep" aria-hidden="true">/</span>
                  <span className="crumb-current">{pageTitle}</span>
                </>
              )}
            </strong>
          </div>
          <div className="admin-navbar-actions">
            <div className="navbar-profile">
              <div className="admin-avatar">{initials}</div>
              <div>
                <strong>{profile.name || "Administrator"}</strong>
                <span>{profile.email || "Admin account"}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
