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
    label: "Publishing",
    type: "checkbox",
    checkboxLabel: "Publish on the public website",
  },
];

const statusLabels = { isActive: ["Published", "Unpublished"] };

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
          { key: "features", label: "Technologies" },
          { key: "isActive", label: "Status" },
        ]}
        statusLabels={statusLabels}
        emptyMessage="No services added yet. Add your first service to get started."
      />
    </AdminLayout>
  );
}