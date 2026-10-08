import ContentManager from "../components/ContentManager";
import AdminLayout from "../components/AdminLayout";
import { siteContentResources } from "../data/siteContent";

const fields = [
  {
    name: "name",
    label: "Service name",
    required: true,
  },
  {
    name: "summary",
    label: "Short description",
    type: "textarea",
    required: true,
  },
  {
    name: "imageUrl",
    label: "Service image",
    type: "url",
  },
  {
    name: "icon",
    label: "Icon name",
    placeholder: "e.g. Code2, Cloud, Database",
  },
  {
    name: "features",
    label: "Technologies / Tags",
    type: "tags",
  },
  {
    name: "isActive",
    label: "Visibility",
    type: "checkbox",
    checkboxLabel: "Show on public website",
  },
];

export default function Services() {
  return (
    <AdminLayout>
      <ContentManager
        title="Services"
        description="Add and manage the services shown on your website."
        resource={siteContentResources.services}
        fields={fields}
        columns={[
          { key: "name", label: "Service" },
          { key: "summary", label: "Description" },
          { key: "imageUrl", label: "Image" },
          { key: "features", label: "Technologies" },
          { key: "isActive", label: "Status" },
        ]}
        emptyMessage="No services added yet. Add your first service to get started."
      />
    </AdminLayout>
  );
}