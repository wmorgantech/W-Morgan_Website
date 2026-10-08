import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logoMark from "../assets/logo-mark.png";
import {
  LayoutDashboard,
  Package,
  BriefcaseBusiness,
  MessageSquareQuote,
  Users,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Product Suite",
    path: "/products",
    icon: Package,
  },
  {
    name: "Services",
    path: "/services",
    icon: BriefcaseBusiness,
  },
  {
    name: "Portfolio",
    path: "/portfolio",
    icon: BriefcaseBusiness,
  },
  {
    name: "Testimonials",
    path: "/testimonials",
    icon: MessageSquareQuote,
  },
  {
    name: "Careers",
    path: "/careers",
    icon: Users,
  },
  {
    name: "Contact Inquiries",
    path: "/contact",
    icon: Mail,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("adminProfile");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="admin-navigation"
        >
          <Menu size={24} />
        </button>

        <div className="brand-lockup brand-lockup-mobile">
          <span className="brand-mark"><img src={logoMark} alt="" /></span>
          <span className="brand-copy">
            <strong>W Morgan Technologies</strong>
            <small>Empowered by Innovation</small>
          </span>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      <aside
        className={`admin-sidebar ${
          collapsed ? "collapsed" : ""
        } ${mobileOpen ? "mobile-open" : ""}`}
      >
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <div className="brand-lockup">
              <span className="brand-mark"><img src={logoMark} alt="" /></span>
              {!collapsed && (
                <span className="brand-copy">
                  <strong>W Morgan Technologies</strong>
                  <small>Empowered by Innovation</small>
                </span>
              )}
            </div>
          </div>

          <button
            className="mobile-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav id="admin-navigation" className="sidebar-nav" aria-label="Admin navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} />

                {!collapsed && (
                  <span>{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight size={19} />
            ) : (
              <ChevronLeft size={19} />
            )}

            {!collapsed && <span>Collapse Menu</span>}
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={19} />

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}