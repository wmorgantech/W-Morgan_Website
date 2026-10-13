import ContentManager from "../components/ContentManager";
import AdminLayout from "../components/AdminLayout";
import { siteContentResources } from "../data/siteContent";

const fields = [
  {
    name: "authorName",
    label: "Client name",
    required: true,
  },
  {
    name: "location",
    label: "Location",
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
    name: "quote",
    label: "Testimonial (client's words)",
    type: "textarea",
    hint: "Optional. Only add words the client has actually approved. Without a quote, the website shows just the client's name and location.",
  },
  {
    name: "avatarUrl",
    label: "Client photo",
    type: "image",
  },
  {
    name: "featured",
    label: "Publishing",
    type: "checkbox",
    checkboxLabel: "Publish on the public website",
    hint: "Unpublished testimonials stay in Admin and never appear on the website.",
  },
];

const detailFields = [
  { key: "quote", label: "Testimonial", type: "long" },
  { key: "location", label: "Location" },
  { key: "role", label: "Role" },
  { key: "company", label: "Company" },
  { key: "updatedAt", label: "Last updated", type: "date" },
];

const statusLabels = { featured: ["Published", "Unpublished"] };

export default function Testimonials() {
  return (
    <AdminLayout>
      <ContentManager
        title="Testimonials"
        itemName="Testimonial"
        description="Add and manage client testimonials. Only published testimonials appear on the website."
        resource={siteContentResources.testimonials}
        fields={fields}
        detailFields={detailFields}
        statusLabels={statusLabels}
        columns={[
          { key: "authorName", label: "Client" },
          { key: "location", label: "Location" },
          { key: "quote", label: "Testimonial" },
          { key: "featured", label: "Status" },
        ]}
        emptyMessage="No testimonials added yet. Add your first testimonial to get started."
      />
    </AdminLayout>
  );
}
