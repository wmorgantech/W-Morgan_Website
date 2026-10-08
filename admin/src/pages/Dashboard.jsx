import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Mail,
  MessageSquareQuote,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import api, { getApiError } from "../lib/api";

const metrics = [
  {
    key: "products",
    title: "Active products",
    icon: Package,
    to: "/products",
  },
  {
    key: "activeServices",
    title: "Active services",
    icon: BriefcaseBusiness,
    to: "/services",
  },
  {
    key: "projects",
    title: "Portfolio projects",
    icon: ArrowUpRight,
    to: "/portfolio",
  },
  {
    key: "newInquiries",
    title: "New inquiries",
    icon: Mail,
    to: "/contact",
  },
  {
    key: "testimonials",
    title: "Testimonials",
    icon: MessageSquareQuote,
    to: "/testimonials",
  },
  {
    key: "openJobs",
    title: "Open roles",
    icon: BriefcaseBusiness,
    to: "/careers",
  },
];

const quickLinks = [
  {
    to: "/products",
    label: "Products",
    detail: "Manage product listings",
    icon: Package,
  },
  {
    to: "/services",
    label: "Services",
    detail: "Manage service listings",
    icon: BriefcaseBusiness,
  },
  {
    to: "/portfolio",
    label: "Portfolio",
    detail: "Manage selected projects",
    icon: ArrowUpRight,
  },
  {
    to: "/testimonials",
    label: "Testimonials",
    detail: "Manage client feedback",
    icon: MessageSquareQuote,
  },
  {
    to: "/careers",
    label: "Careers",
    detail: "Manage job openings",
    icon: BriefcaseBusiness,
  },
  {
    to: "/contact",
    label: "Contact",
    detail: "Review inquiries",
    icon: Mail,
  },
];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then(({ data }) => setSummary(data))
      .catch((requestError) => setError(getApiError(requestError)));
  }, []);

  return (
    <AdminLayout>
      <div className="dashboard-page">
        <header className="page-header">
          <div>
            <p className="page-eyebrow">ADMIN PANEL</p>
            <h1>Dashboard</h1>
            <p className="page-description">
              Overview of your website content and activity.
            </p>
          </div>
        </header>

        {error && (
          <p className="content-error" role="alert">
            {error}
          </p>
        )}

        <section className="stats-grid" aria-label="Website overview">
          {metrics.map(({ key, title, icon: Icon, to }) => (
            <Link
              to={to}
              className="stat-card"
              key={key}
              aria-label={`${title}: ${summary ? summary[key] : "loading"}`}
            >
              <div className="stat-card-top">
                <div className="stat-icon">
                  <Icon size={19} strokeWidth={1.8} />
                </div>

                <ArrowUpRight
                  size={15}
                  className="quick-action-arrow"
                  aria-hidden="true"
                />
              </div>

              <div className="stat-value">
                {summary ? summary[key] : "—"}
              </div>

              <div className="stat-title">{title}</div>
            </Link>
          ))}
        </section>

        <section className="dashboard-card">
          <header className="card-header">
            <div>
              <h2>Manage content</h2>
              <p>Quick access to your website collections.</p>
            </div>
          </header>

          <div className="quick-actions">
            {quickLinks.map(({ to, label, detail, icon: Icon }) => (
              <Link to={to} className="quick-action" key={to}>
                <div className="quick-action-icon">
                  <Icon size={18} strokeWidth={1.8} />
                </div>

                <div>
                  <strong>{label}</strong>
                  <span>{detail}</span>
                </div>

                <ArrowUpRight
                  size={15}
                  className="quick-action-arrow"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
