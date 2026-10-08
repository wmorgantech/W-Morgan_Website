import ContentManager from "../components/ContentManager";
import AdminLayout from "../components/AdminLayout";
import { siteContentResources } from "../data/siteContent";

const fields = [
  {
    name: "quote",
    label: "Testimonial",
    type: "textarea",
    required: true,
  },
  {
    name: "authorName",
    label: "Client name",
    required: true,
  },
  {
    name: "role",
    label: "Role",
  },
  {
    name: "company",
    label: "Company",
  },
  {
    name: "avatarUrl",
    label: "Client photo",
    type: "image",
  },
  {
    name: "featured",
    label: "Visibility",
    type: "checkbox",
    checkboxLabel: "Show on public website",
  },
];

export default function Testimonials() {
  return (
    <AdminLayout>
      <ContentManager
        title="Testimonials"
        description="Add and manage client testimonials shown on your website."
        resource={siteContentResources.testimonials}
        fields={fields}
        columns={[
          { key: "quote", label: "Testimonial" },
          { key: "authorName", label: "Client" },
          { key: "role", label: "Role" },
          { key: "company", label: "Company" },
          { key: "featured", label: "Status" },
        ]}
        emptyMessage="No testimonials added yet. Add your first testimonial to get started."
      />
    </AdminLayout>
  );
}